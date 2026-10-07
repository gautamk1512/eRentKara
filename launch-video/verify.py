from pathlib import Path
import subprocess,sys,re
root=Path(__file__).resolve().parent
sys.path.insert(0,str(root.parent/'.launch-deps'))
import imageio_ffmpeg
ff=imageio_ffmpeg.get_ffmpeg_exe()
for path in sorted(root.glob('*.mp4')):
    p=subprocess.run([ff,'-i',str(path),'-f','null','-'],capture_output=True,text=True)
    if p.returncode: raise RuntimeError(p.stderr[-2000:])
    duration=re.search(r'Duration: ([0-9:.]+)',p.stderr).group(1)
    streams=[line.strip() for line in p.stderr.splitlines() if 'Stream #0:' in line][:2]
    print(path.name,'duration='+duration,'bytes='+str(path.stat().st_size),*streams,sep='\n')
    subprocess.run([ff,'-y','-ss','56','-i',str(path),'-frames:v','1',str(root/(path.stem+'-preview.jpg'))],capture_output=True,check=True)
