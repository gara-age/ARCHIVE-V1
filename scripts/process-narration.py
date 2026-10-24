"""Conservative local narration cleanup. Requires numpy and macOS afconvert.
Decode with afconvert to /tmp/archive-narration/<source>.wav first.
Original recordings remain untouched in Downloads.
"""
import hashlib, json, wave
from pathlib import Path
import numpy as np

sources = [
 ('00_studio','00-studio'), ('01_bokji','01-bokji'), ('01_navi','01-navi'),
 ('02_archievements','02-achievements'), ('03_certifications','03-certifications'),
 ('04_experience','04-experience'), ('05_campus','05-campus'),
 ('06_howiwork','06-how-i-work'), ('07_mystory','07-my-story'),
 ('08_beyond','08-beyond'), ('09_contact','09-contact'),
]
work = Path('/tmp/archive-narration')
report = []
def db(value): return float(20 * np.log10(max(float(value), 1e-9)))
def smooth(a, width, axis):
    pad = [(0,0)] * a.ndim; pad[axis] = (width//2, width//2)
    padded = np.pad(a, pad, mode='edge')
    result = np.zeros_like(a)
    for i in range(width):
        slices = [slice(None)]*a.ndim; slices[axis] = slice(i, i+a.shape[axis])
        result += padded[tuple(slices)] / width
    return result
for source, target in sources:
    with wave.open(str(work / (source+'.wav'))) as w:
        rate=w.getframerate(); channels=w.getnchannels(); assert w.getsampwidth()==2
        x=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float64).reshape(-1,channels).mean(axis=1)/32768
    original=x.copy(); n=2048; hop=512; window=np.hanning(n)
    padded=np.pad(x,(n,n)); total=1+(len(padded)-n)//hop
    frames=np.lib.stride_tricks.sliding_window_view(padded,n)[::hop][:total]
    spectrum=np.fft.rfft(frames*window,axis=1)
    magnitude=np.abs(spectrum)
    rms=np.sqrt(np.mean(frames**2,axis=1)+1e-15)
    quiet=rms <= np.percentile(rms,20)
    noise=np.percentile(magnitude[quiet],50,axis=0)
    # Bounded attenuation prevents spectral holes and preserves consonants.
    gain=np.clip(1-0.7*noise[None,:]/(magnitude+1e-8),0.45,1)
    gain=smooth(smooth(gain,5,1),5,0)
    frequencies=np.fft.rfftfreq(n,1/rate)
    highpass=1/np.sqrt(1+(75/np.maximum(frequencies,1))**8)
    spectrum *= gain*highpass[None,:]
    frame_db=20*np.log10(rms+1e-9)
    threshold=min(-38.,float(np.percentile(frame_db,20))+5.)
    # A gentle downward expander reduces quiet breaths/room noise, never hard-mutes.
    reduction=np.clip((threshold-frame_db)*0.65,0,9)
    envelope=smooth(10**(-reduction/20),11,0)
    restored=np.fft.irfft(spectrum,n=n,axis=1)*window*envelope[:,None]
    output=np.zeros(len(padded)); weight=np.zeros(len(padded))
    for i in range(total):
        start=i*hop; output[start:start+n]+=restored[i]; weight[start:start+n]+=window**2
    output=(output/np.maximum(weight,1e-9))[n:n+len(x)]
    # Match active-speech RMS with a peak ceiling; do not claim LUFS normalization.
    speech=rms > np.percentile(rms,60)
    speech_rms=float(np.sqrt(np.mean(rms[speech]**2)))
    volume=min(10**((-22-db(speech_rms))/20),10**(-1/20)/(np.max(np.abs(output))+1e-9))
    output*=volume
    edge=min(int(rate*.008),len(output)//2)
    output[:edge]*=np.linspace(0,1,edge); output[-edge:]*=np.linspace(1,0,edge)
    assert len(output)==len(original) and np.isfinite(output).all()
    with wave.open(str(work/(target+'-clean.wav')),'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate)
        w.writeframes((np.clip(output,-1,1)*32767).astype('<i2').tobytes())
    source_path=Path.home()/'Downloads'/(source+'.m4a')
    # Compare the same quiet 20ms windows before/after, excluding start/end fades.
    block=rate//50; length=len(original)//block*block
    before=np.sqrt(np.mean(original[:length].reshape(-1,block)**2,axis=1))
    after=np.sqrt(np.mean(output[:length].reshape(-1,block)**2,axis=1))
    low=(before>1e-6)&(before<=np.percentile(before,20))
    item=dict(source=source_path.name,output=target+'.m4a',sha256=hashlib.sha256(source_path.read_bytes()).hexdigest(),duration=round(len(x)/rate,3),sampleRate=rate,peakBeforeDb=round(db(np.max(abs(original))),2),peakAfterDb=round(db(np.max(abs(output))),2),gainDb=round(db(volume),2),quietWindowChangeDb=round(db(np.sqrt(np.mean(after[low]**2)))-db(np.sqrt(np.mean(before[low]**2))),2))
    report.append(item);print(json.dumps(item,ensure_ascii=False),flush=True)
Path('docs/narration-processing.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
