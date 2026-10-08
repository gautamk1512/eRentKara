"""Bounded, read-only production smoke checks; no login/payment/customer writes."""
import json,time,urllib.request,urllib.error
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
ROOT=Path(__file__).resolve().parents[1]
routes=[]
for page in (ROOT/'frontend/src/app').rglob('page.tsx'):
    parts=page.parent.relative_to(ROOT/'frontend/src/app').parts
    if any('[' in part or part.startswith('(') for part in parts): continue
    routes.append(('/'+'/'.join(parts),[200]))
for path in ['marketplace/search/','marketplace/cities/','marketplace/stats/','agreements/pricing-config/','agreements/clauses/']:
    routes.append(('/api/v1/'+path,[200]))
for path in ['auth/me/','properties/','tenants/','invoices/','payments/','complaints/','visitors/','leads/','agreements/orders/','agreements/admin-orders/']:
    routes.append(('/api/v1/'+path,[401,403]))
def check(item):
    path,expected=item; start=time.perf_counter(); error=None; status=0
    try:
        request=urllib.request.Request('https://erentkarar.com'+path,headers={'User-Agent':'eRentKarar-authorized-QA/1.0'})
        with urllib.request.urlopen(request,timeout=30) as response: status=response.status; response.read()
    except urllib.error.HTTPError as exc: status=exc.code
    except Exception as exc: error=type(exc).__name__
    time.sleep(.15)
    return {'route':path,'http':status,'expected':expected,'pass':status in expected,'ms':round((time.perf_counter()-start)*1000,2),'error':error}
with ThreadPoolExecutor(max_workers=2) as pool: results=list(pool.map(check,routes))
dest=ROOT/'qa/results'; dest.mkdir(exist_ok=True)
(dest/'live-smoke.json').write_text(json.dumps(results,indent=2))
print(json.dumps({'total':len(results),'passed':sum(r['pass'] for r in results),'failures':[r for r in results if not r['pass']]}))
