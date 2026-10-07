import os, sys, math, subprocess, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/'.launch-deps'))
import imageio_ffmpeg
FF=imageio_ffmpeg.get_ffmpeg_exe()
FPS=24
WHITE='#f4f8ff'; MUTED='#9baec9'; GREEN='#45e4b1'; BLUE='#529eff'
fonts={}
def font(n,bold=False):
    k=(n,bold)
    if k not in fonts: fonts[k]=ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf' if bold else 'C:/Windows/Fonts/segoeui.ttf',n)
    return fonts[k]
def ease(x): return 1-(1-max(0,min(1,x)))**3
scenes=[(0,7,'RENTING. REIMAGINED.',['Less friction.','More possibility.'],'Your next chapter starts here.'),(7,14,'INTRODUCING',['eRentKarar'],'One platform for your rental journey.'),(14,23,'DISCOVER',['Find your','next home.'],'PGs. Hostels. Flats. Co-living.'),(23,33,'MANAGE',['Every property.','One clear view.'],'Rooms, tenants, rent and maintenance.'),(33,43,'AGREEMENTS',['Move forward.','With clarity.'],'Draft, track and manage rental agreements.'),(43,52,'CONNECTED',['From finding a stay','to managing it.'],'A simpler rental experience for India.'),(52,60,'YOUR NEXT MOVE',['Meet eRentKarar.'],'Explore the platform today.')]
def soundtrack():
    sr=44100; t=np.arange(60*sr)/sr; y=np.zeros(len(t)); rng=np.random.default_rng(8)
    chords=[[130.81,164.81,196],[110,130.81,164.81],[87.31,110,130.81],[98,123.47,146.83]]
    for beat in np.arange(0,60,.625):
        start=int(beat*sr); n=min(int(.55*sr),len(y)-start); u=np.arange(n)/sr
        y[start:start+n]+=.16*np.sin(2*np.pi*(48*u+4*(1-np.exp(-u*30))))*np.exp(-u*15)
        if int(round(beat/.625))%2: y[start:start+n]+=.018*rng.standard_normal(n)*np.exp(-u*45)
    for j in range(24):
        start=int(j*2.5*sr); n=min(int(3*sr),len(y)-start); u=np.arange(n)/sr
        env=np.minimum(u/.25,1)*np.exp(-u*.8)
        for f in chords[j%4]: y[start:start+n]+=.032*np.sin(2*np.pi*f*u)*env
        f=chords[j%4][j%3]*4; y[start:start+n]+=.025*np.sin(2*np.pi*f*u)*np.exp(-u*3)
    y*=np.minimum(t/2,1)*np.minimum((60-t)/3,1)
    stereo=np.stack([y,y*.97],axis=1); pcm=(np.clip(stereo,-1,1)*32767).astype('<i2')
    with wave.open(str(ROOT/'soundtrack.wav'),'wb') as f: f.setnchannels(2); f.setsampwidth(2); f.setframerate(sr); f.writeframes(pcm.tobytes())
def frame(t,W,H):
    # Work on a design canvas that adapts to each social format.
    scale=W/1080; portrait=H>W; landscape=W>H
    im=Image.new('RGB',(W,H),'#070e1d'); d=ImageDraw.Draw(im)
    def xy(x,y): return (int(x*scale),int(y*scale))
    def text(x,y,s,n=28,c=WHITE,b=False): d.text(xy(x,y),s,font=font(max(10,int(n*scale)),b),fill=c)
    def box(x,y,w,h,fill='#101e34',outline='#243956',r=20): d.rounded_rectangle((*xy(x,y),*xy(x+w,y+h)),radius=int(r*scale),fill=fill,outline=outline,width=max(1,int(scale)))
    ch=H/scale
    for i in range(16):
        x=(i*113+t*8)%1160-40
        d.line([xy(x,0),xy(x-230,ch)],fill='#101b2e',width=1)
    # Orbital architectural lines.
    for r in [230,330,440]:
        cx=850+25*math.sin(t*.3); cy=ch*.5
        d.arc((*xy(cx-r,cy-r),*xy(cx+r,cy+r)),int(t*4)%360,int(t*4)%360+230,fill='#142a43',width=max(1,int(2*scale)))
    box(55,38,40,40,'#0b73dd',r=11)
    d.line([xy(63,58),xy(75,47),xy(87,58)],fill=WHITE,width=max(2,int(3*scale)))
    d.line([xy(66,56),xy(66,69),xy(84,69),xy(84,56)],fill=WHITE,width=max(2,int(3*scale)))
    text(110,39,'eRentKarar',26,b=True); text(55,ch-47,'erentkarar.com',19,c=MUTED)
    text(885,ch-47,'PRODUCT LAUNCH',13,c=MUTED)
    scene=next(s for s in scenes if s[0]<=t<s[1]); a,b,label,lines,sub=scene; p=t-a
    offset=35*(1-ease(p/1.1)); y=145 if landscape else 190 if not portrait else 285
    text(60,y+offset,label,17,GREEN,True)
    title_size=64 if landscape else 74
    if len(lines[0])>18: title_size=54 if landscape else 60
    for i,line in enumerate(lines): text(55,y+48+i*(title_size+10)+offset,line,title_size,b=True)
    text(60,y+64+len(lines)*(title_size+10)+offset,sub,23 if landscape else 25,c=MUTED)
    panel_y=140 if landscape else 540 if not portrait else 720
    panel_x=620 if landscape else 70; panel_w=400 if landscape else 940
    def card(y,h=65): box(panel_x+22,panel_y+y,panel_w-44,h)
    if a in (0,7,52):
        if landscape:
            box(panel_x,panel_y,panel_w,350,'#0c192c')
            for j,(name,desc) in enumerate([('Discover','Find a place to call home'),('Manage','Keep your rentals in sync'),('Agreements','Bring every detail together')]):
                card(28+j*94,78); text(panel_x+42,panel_y+40+j*94,name,23,b=True); text(panel_x+42,panel_y+72+j*94,desc,15,MUTED)
        else:
            for j,(name,desc) in enumerate([('Discover','Find a place to call home'),('Manage','Keep your rentals in sync'),('Agreements','Bring every detail together')]):
                box(panel_x,panel_y+j*112,panel_w,94); text(panel_x+25,panel_y+15+j*112,name,28,b=True); text(panel_x+25,panel_y+53+j*112,desc,21,MUTED)
        if a==52: box(60,y+240,360,66,'#45e4b1',r=33); text(86,y+250,'erentkarar.com  →',28,'#071c1a',True)
    elif a==14:
        box(panel_x,panel_y,panel_w,365,'#0c192c'); text(panel_x+24,panel_y+22,'Find your next stay',26,b=True)
        for j,name in enumerate(['PG & hostel','Residential flats','Co-living spaces']):
            card(76+j*88,72); text(panel_x+40,panel_y+87+j*88,name,24,b=True); text(panel_x+40,panel_y+118+j*88,'Explore properties  →',16,GREEN)
    elif a==23:
        box(panel_x,panel_y,panel_w,365,'#0c192c'); text(panel_x+24,panel_y+22,'Your rental workspace',25,b=True)
        for j,name in enumerate(['Property & bed inventory','Tenants & rent invoices','Maintenance requests']):
            card(80+j*87,67); text(panel_x+40,panel_y+96+j*87,name,21,b=True)
            progress=ease((p-j*.4)/3)
            d.line([xy(panel_x+40,panel_y+133+j*87),xy(panel_x+40+(panel_w-90)*progress,panel_y+133+j*87)],fill=GREEN,width=max(2,int(3*scale)))
    elif a==33:
        box(panel_x,panel_y,panel_w,365,'#e9eef7'); text(panel_x+27,panel_y+26,'RENTAL AGREEMENT',21,'#152640',True)
        for j in range(6):
            ww=(panel_w-60)*ease((p-j*.12)/2)
            d.line([xy(panel_x+30,panel_y+90+j*25),xy(panel_x+30+ww,panel_y+90+j*25)],fill='#9babbd',width=max(2,int(3*scale)))
        text(panel_x+30,panel_y+269,'Draft  •  Track  •  Manage',20,'#08795c',True)
    else:
        for j,name in enumerate(['DISCOVER','MANAGE','AGREEMENTS']):
            box(panel_x,panel_y+j*110,panel_w,86); text(panel_x+25,panel_y+26+j*110,name,27,GREEN,True)
    # Scene entrance/exit produces a brief cinematic dissolve.
    opacity=min(ease(p/.65),ease((b-t)/.45))
    if opacity<1: im=Image.blend(Image.new('RGB',(W,H),'#070e1d'),im,opacity)
    return im
def render(name,W,H):
    target=ROOT/name
    cmd=[FF,'-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-i',str(ROOT/'soundtrack.wav'),'-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-t','60','-movflags','+faststart',str(target)]
    with open(ROOT/(name+'.log'),'w') as log:
        proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=log)
        for i in range(60*FPS):
            proc.stdin.write(frame(i/FPS,W,H).tobytes())
            if i%(FPS*10)==0: print(name,int(i/FPS),'seconds',flush=True)
        proc.stdin.close(); rc=proc.wait()
        if rc: raise RuntimeError('Encoder failed: '+str(rc))
    print('COMPLETE',target,flush=True)
if __name__=='__main__':
    ROOT.mkdir(exist_ok=True); soundtrack()
    frame(26,1080,1080).save(ROOT/'launch-poster.jpg',quality=95)
    frames=[frame(t,640,360) for t in [3,10,18,27,37,47,56]]
    sheet=Image.new('RGB',(1280,1440),'#070e1d')
    for i,f in enumerate(frames): sheet.paste(f,((i%2)*640,(i//2)*360))
    sheet.save(ROOT/'storyboard.jpg',quality=95)
    for args in [('eRentKarar-launch-landscape.mp4',1920,1080),('eRentKarar-launch-square.mp4',1080,1080),('eRentKarar-launch-vertical.mp4',1080,1920)]: render(*args)
