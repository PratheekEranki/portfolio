"""Create an editable LaTeX resume from reviewed portfolio content.

python scripts/generate-resume.py --stdout
python scripts/generate-resume.py --compiler /path/to/tectonic
"""
import argparse
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'src/portfolio.json').read_text(encoding='utf-8'))

def tex(value):
    value = value.replace('–', '--').replace('—', '---').replace('−', '-').replace('’', "'").replace('→', ' to ').replace('²', '2')
    mapping = {'\\':r'\textbackslash{}','&':r'\&','%':r'\%','$':r'\$','#':r'\#','_':r'\_','{':r'\{','}':r'\}','~':r'\textasciitilde{}','^':r'\textasciicircum{}','·':r'\textperiodcentered{}'}
    return ''.join(mapping.get(c,c) for c in value)

def link(url,label):
    url = url.replace('%',r'\%').replace('#',r'\#').replace('&',r'\&').replace('_',r'\_')
    return r'\href{' + url + '}{' + tex(label) + '}'

def source():
    p=DATA['profile']
    lines=[r'''\documentclass[11pt,letterpaper]{article}
\usepackage[top=0.42in,bottom=0.45in,left=0.45in,right=0.45in]{geometry}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{mathptmx}
\usepackage{microtype}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{needspace}
\usepackage[hidelinks]{hyperref}
\hypersetup{pdftitle={Pratheek Eranki Resume},pdfauthor={Pratheek Eranki}}
\pagestyle{empty}
\raggedright
\setlength{\parindent}{0pt}
\setlength{\parskip}{1.5pt}
\setlength{\emergencystretch}{2em}
\linespread{0.98}
\titleformat{\section}{\needspace{3\baselineskip}\fontsize{12}{14}\selectfont\bfseries}{}{0pt}{}[\vspace{-1pt}\titlerule]
\titlespacing*{\section}{0pt}{4pt}{4pt}
\setlist[itemize]{leftmargin=11pt,itemsep=1pt,topsep=2pt,parsep=0pt,partopsep=0pt,label=\textbullet}
\newcommand{\entry}[3]{\needspace{11\baselineskip}\noindent\textbf{#1}\hfill #3\\[-1pt]\textit{#2}\par}
\begin{document}
\fontsize{10.5}{12}\selectfont
\begin{center}
{\fontsize{29}{32}\selectfont Pratheek Eranki}\par
\vspace{4pt}
''']
    contacts=[tex(p['location']),link('mailto:'+p['email'],p['email']),link('tel:'+re.sub(r'[^+0-9]','',p['phone']),p['phone']),link(p['linkedin'],'LinkedIn'),link(p['github'],'GitHub'),link('https://pratheekeranki.github.io/portfolio/','Portfolio')]
    lines.append(r'{\small{} ' + r' \textbar{} '.join(contacts) + r'}\par\end{center}\vspace{-9pt}')
    lines += [r'\section*{Summary}',tex(p['resumeSummary']),r'\section*{Education}']
    for e in DATA['education']:
        if not e.get('includeInResume', True):
            continue
        lines.append(r'\textbf{'+tex(e['school'])+r'}\hfill{\small{}'+tex(e['period'])+r'}\\')
        lines.append(tex(e['degree'])+r'\hfill{\small{} '+tex(e['note'])+r'}\par\vspace{2pt}')
    lines.append(r'\section*{Skills}')
    for g in DATA['resumeSkills']:
        lines.append(r'\textbf{'+tex(g['title'])+':} '+tex(', '.join(g['items']))+r'\par')
    lines.append(r'\section*{Experience}')
    for job in DATA['experience']:
        lines.append(r'\entry{'+tex(job['company'])+'}{'+tex(job['role'])+'}{'+tex(job['period'])+'}')
        lines.append(tex(job['summary']))
        lines.append(r'\begin{itemize}')
        lines.extend(r'\item '+tex(b) for b in job['bullets'])
        lines.append(r'\end{itemize}\vspace{2pt}')
    lines.append(r'\section*{Projects}')
    for pid in ['fieldverify','opsflow','fixbot']:
        project=next(x for x in DATA['projects'] if x['id']==pid)
        url=next(x['url'] for x in project['links'] if x['url'].startswith('https://github.com'))
        lines.append(r'\needspace{5\baselineskip}\textbf{'+tex(project['title'])+r'}\hfill{\small{} '+link(url,'Code')+r' \textbar\ '+link('https://pratheekeranki.github.io/portfolio/#project/'+pid,'Case study')+r'}\\')
        lines.append(r'{\small{}'+tex(' / '.join(project['tags']))+r'}\par')
        lines.append(r'\begin{itemize}')
        for detail in [project['contribution'], *project['approach']]:
            lines.append(r'\item '+tex(detail))
        lines.append(r'\end{itemize}\vspace{3pt}')
    lines.append(r'\section*{Publications}')
    paper=next(x for x in DATA['projects'] if x['id']=='rhamba')['publication']
    lines.append(tex(paper['authors'])+'. '+r'\textit{'+tex(paper['title'])+'}. '+tex(paper['status'])+' '+link('https://arxiv.org/abs/2605.01240','arXiv:2605.01240')+'.')
    lines.append(r'\section*{Certifications}')
    lines.append(r'\begin{itemize}')
    for cert in DATA['certifications']:
        lines.append(r'\item '+tex(cert['title'])+r' \textemdash{} '+tex(cert['issuer'])+r' \hfill {\small{}'+tex(cert['date'])+'}')
    lines += [r'\end{itemize}',r'{\small{} '+link(p['credentialsUrl'],'Credentials on LinkedIn')+'}',r'\end{document}']
    return '\n'.join(lines)+'\n'

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--stdout',action='store_true')
    parser.add_argument('--source-only',action='store_true')
    parser.add_argument('--compiler',default='tectonic')
    args=parser.parse_args()
    rendered=source()
    if args.stdout:
        print(rendered,end='')
        return
    directory=ROOT/'resume'
    directory.mkdir(exist_ok=True)
    main_tex=directory/'main.tex'
    main_tex.write_text(rendered,encoding='utf-8')
    public=ROOT/'public'
    shutil.copyfile(main_tex,public/'Pratheek-Eranki-Resume.tex')
    if args.source_only:
        print(main_tex)
        return
    with tempfile.TemporaryDirectory(prefix='portfolio-latex-') as output:
        subprocess.run([args.compiler,'--keep-logs','--outdir',output,str(main_tex)],check=True)
        shutil.copyfile(Path(output)/'main.pdf',public/'Pratheek-Eranki-Resume.pdf')
    print(public/'Pratheek-Eranki-Resume.pdf')

if __name__=='__main__': main()
