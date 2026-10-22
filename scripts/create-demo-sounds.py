import math, wave, array, subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
rate=22050
# Original short synthesized arrangements: no sampled recordings or borrowed melody.
for name,bpm,chords,melody in [
 ('golden',80,[(48,55,59,64),(45,52,55,60),(41,48,52,57),(43,50,55,59)],[76,71,67,74,72,69,64,67]),
 ('after',100,[(45,52,55,60),(41,48,52,57),(48,55,59,64),(43,50,53,59)],[69,76,72,67,71,74,67,64]),
 ('soft',64,[(48,55,62,64),(41,48,55,57),(45,52,59,60),(43,50,57,59)],[79,76,74,71,72,76,69,67])]:
 beat=60/bpm
 duration=16*beat
 samples=[0.0]*int(rate*duration)
 def tone(note,start,length,amp,pluck=False):
  freq=440*2**((note-69)/12)
  begin=int(start*rate)
  for j in range(min(int(length*rate),len(samples)-begin)):
   t=j/rate
   env=min(1,t/0.028)*min(1,(length-t)/0.16)
   if pluck: env*=math.exp(-t*3.0)
   v=(math.sin(2*math.pi*freq*t)+.23*math.sin(2*math.pi*freq*2*t)+.09*math.sin(2*math.pi*freq*3*t))
   samples[begin+j]+=amp*env*v
 for bar,chord in enumerate(chords):
  for note in chord: tone(note,bar*4*beat,4*beat,.065)
  for n in range(4): tone(chord[0]-12,(bar*4+n)*beat,.7*beat,.10,True)
 for n,note in enumerate(melody): tone(note,(n*2+.5)*beat,1.35*beat,.16,True)
 if name!='soft':
  for n in range(16):
   start=int(n*beat*rate)
   for j in range(min(int(.15*rate),len(samples)-start)):
    t=j/rate
    samples[start+j]+=.09*math.sin(2*math.pi*(48*t+2*(1-math.exp(-t*35))))*math.exp(-t*25)
 peak=max(abs(x) for x in samples)
 pcm=array.array('h',(int(max(-1,min(1,x/peak*.76))*32767*min(1,i/(rate*.025),(len(samples)-i)/(rate*.06))) for i,x in enumerate(samples)))
 path=Path('/tmp')/f'charett-{name}.wav'
 with wave.open(str(path),'wb') as f: f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(pcm.tobytes())
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i',str(path),'-codec:a','libmp3lame','-b:a','80k','-map_metadata','-1','-y',str(root/'public/assets'/f'sound-{name}.mp3')],check=True)
 print(name,round(duration,2),'seconds')
