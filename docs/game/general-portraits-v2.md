# 장수 초상화 확대 제작

2026-10-26. built-in image_gen 사용. 홍유 v2를 그림체 참고로 사용. 실제 역사 인물의 용모·나이·성격을 단정하는 자료가 아닌 게임용 창작 초안.

## 공통 기준

128×160 WebP 품질80, 얼굴·어깨 중심 4:5 구도, 따뜻한 종이색 배경, 왼쪽 위 광원, 또렷한 윤곽. 병과의 인상은 목·어깨 폭·턱·복식으로 표현하되 능력치나 인격의 우열을 뜻하지 않는다. 기병은 단단한 체격, 궁병은 마른 근육과 집중력, 무도가는 두꺼운 목과 넓은 어깨, 책사는 가는 윤곽과 침착한 눈빛으로 구분한다. 같은 병과 안에서도 코·눈썹·턱·수염·표정을 다르게 한다. 실제 수치는 변경하지 않는다.

원본 characters.json은 보존하고 general-portraits.json에서 새 초상화만 연결한다. 기존 플레이 장수 데이터와 대표 인물 데이터도 같은 경로를 사용한다.

## 복지겸

파일: `web/public/images/representatives/bok-jigyeom-portrait-v2.webp` · 5892바이트

프롬프트:

Use case: stylized-concept. Create a newly designed head-and-shoulders portrait for 복지겸, Korean historical-fantasy tactical RPG. A disciplined Korean cavalry officer with a long rectangular face, high cheekbones, straight narrow eyes, a thin neat moustache and small pointed chin beard, mature forty-year-old appearance, firm neck and athletic shoulders. Quiet watchful expression rather than Hong Yu angry brow. Black topknot, dark moss-green ribbon, basic brown leather lamellar armor over dark green collar. Use reference 1 Hong Yu v2 ONLY as art-style and warm parchment color reference, do NOT copy his face. Reference 2 is previous identity; preserve hair color and general costume palette but redraw facial structure distinctly as specified. Crisp painted retro strategy-game portrait, strong dark outlines, restrained earth colors, graphic shadow shapes legible at 128x160. Vertical 4:5 canvas, complete hair/topknot with 5% headroom, shoulders visible at bottom, face fills central upper 65%, slight three-quarter right-facing gaze, upper-left lighting. Flat warm parchment backdrop. No text, borders, full body, weapons, ornate treasure gear. Game-fiction appearance, not historical likeness.

## 박수경

파일: `web/public/images/representatives/park-sugyeong-portrait-v2.webp` · 6178바이트

프롬프트:

Use case: stylized-concept. Create a newly designed head-and-shoulders portrait for 박수경, Korean historical-fantasy tactical RPG. A lean Korean archer with a narrow diamond-shaped youthful adult face, prominent cheekbones, focused wide almond eyes, straight nose, NO beard or moustache. Wiry strong neck and lean trained shoulders, alert expression. Black tied hair, simple brown cloth headband and olive collar, basic brown leather armor. Not bulky cavalry, not delicate scholar. Use reference 1 Hong Yu v2 ONLY as art-style and warm parchment color reference, do NOT copy his face. Reference 2 is previous identity; preserve hair color and general costume palette but redraw facial structure distinctly as specified. Crisp painted retro strategy-game portrait, strong dark outlines, restrained earth colors, graphic shadow shapes legible at 128x160. Vertical 4:5 canvas, complete hair/topknot with 5% headroom, shoulders visible at bottom, face fills central upper 65%, slight three-quarter right-facing gaze, upper-left lighting. Flat warm parchment backdrop. No text, borders, full body, weapons, ornate treasure gear. Game-fiction appearance, not historical likeness.

## 신숭겸

파일: `web/public/images/representatives/sin-sunggyeom-portrait-v2.webp` · 5592바이트

프롬프트:

Use case: stylized-concept. Create a newly designed head-and-shoulders portrait for 신숭겸, Korean historical-fantasy tactical RPG. A powerfully built Korean martial guard, broad square face, wide jaw and nose, thick neck and very broad shoulders, short dense beard and thick eyebrows. Steady protective warm eyes rather than rage. Black topknot with short plain burgundy tie. Plain layered undyed hemp martial robe with dark red collar, NO METAL OR LEATHER ARMOR, NO helmet. Looks physically strongest of the three but human proportions. Use reference 1 Hong Yu v2 ONLY as art-style and warm parchment color reference, do NOT copy his face. Reference 2 is previous identity; preserve hair color and general costume palette but redraw facial structure distinctly as specified. Crisp painted retro strategy-game portrait, strong dark outlines, restrained earth colors, graphic shadow shapes legible at 128x160. Vertical 4:5 canvas, complete hair/topknot with 5% headroom, shoulders visible at bottom, face fills central upper 65%, slight three-quarter right-facing gaze, upper-left lighting. Flat warm parchment backdrop. No text, borders, full body, weapons, ornate treasure gear. Game-fiction appearance, not historical likeness.

## 왕건

파일: `web/public/images/representatives/wang-geon-portrait-v2.webp` · 5932바이트

프롬프트:

Use case: stylized-concept. Create ONE distinct fictional Korean historical-fantasy strategy game portrait: 왕건, game class 군웅. Composed mature leader around 40, balanced oval-square face, gently lifted thick brows, attentive open eyes, tidy medium moustache and short rounded beard. Strong but not bulky neck. Black topknot with plain dark blue tie, restrained brown leather armor and deep blue collar. Humane confident expression, not a jeweled king. Reference is ONLY a shared art-style example; DO NOT copy its face or costume. Hand-painted retro tactical RPG portrait with crisp dark contours, earthy limited colors, confident brush shadows and warm parchment backdrop, readable on a 128x160 thumbnail. New facial silhouette and facial features specific to description. Vertical 4:5 head-and-shoulders crop, entire head/hair visible with 5% margin, face same scale as reference, slight three-quarter right view, upper-left light. No text, labels, border, weapon, full body, elaborate treasure equipment. Age and face are fictional design proposals not historical portrait reconstructions.

## 유금필

파일: `web/public/images/representatives/yu-geumpil-portrait-v2.webp` · 6108바이트

프롬프트:

Use case: stylized-concept. Create ONE distinct fictional Korean historical-fantasy strategy game portrait: 유금필, game class 경기병. Fearless seasoned cavalry commander around 45, broad wedge face, strong cheekbones, hooked nose, one small healed eyebrow notch, wind-weathered tan complexion, short stubble and broad moustache. Muscular neck, energetic challenging half-smile. High black topknot, dark copper leather lamellar, rust collar. Reference is ONLY a shared art-style example; DO NOT copy its face or costume. Hand-painted retro tactical RPG portrait with crisp dark contours, earthy limited colors, confident brush shadows and warm parchment backdrop, readable on a 128x160 thumbnail. New facial silhouette and facial features specific to description. Vertical 4:5 head-and-shoulders crop, entire head/hair visible with 5% margin, face same scale as reference, slight three-quarter right view, upper-left light. No text, labels, border, weapon, full body, elaborate treasure equipment. Age and face are fictional design proposals not historical portrait reconstructions.

## 박영규

파일: `web/public/images/representatives/park-yeonggyu-portrait-v2.webp` · 5496바이트

프롬프트:

Use case: stylized-concept. Create ONE distinct fictional Korean historical-fantasy strategy game portrait: 박영규, game class 경기병. Elegant experienced cavalry officer around 45, long narrow face, long fine moustache and small tapering goatee, slightly hooded sharp eyes, dignified reserved expression. Lean but firm neck and straight shoulders. Neat black topknot, brown leather armor, muted plum collar. Reference is ONLY a shared art-style example; DO NOT copy its face or costume. Hand-painted retro tactical RPG portrait with crisp dark contours, earthy limited colors, confident brush shadows and warm parchment backdrop, readable on a 128x160 thumbnail. New facial silhouette and facial features specific to description. Vertical 4:5 head-and-shoulders crop, entire head/hair visible with 5% margin, face same scale as reference, slight three-quarter right view, upper-left light. No text, labels, border, weapon, full body, elaborate treasure equipment. Age and face are fictional design proposals not historical portrait reconstructions.

## 배현경

파일: `web/public/images/representatives/bae-hyeongyeong-portrait-v2.webp` · 6092바이트

프롬프트:

Use case: stylized-concept. Create ONE distinct fictional Korean historical-fantasy strategy game portrait: 배현경, game class 궁기병. Rugged mounted archer around 38, wide cheekbones and tapered chin, broad flat nose, dark thick brows, deep-set intensely focused eyes, thick short moustache and rough chin stubble. Athletic shoulders and sturdy neck. Dark cloth brow band, black hair knot, brown leather armor and slate green collar. Reference is ONLY a shared art-style example; DO NOT copy its face or costume. Hand-painted retro tactical RPG portrait with crisp dark contours, earthy limited colors, confident brush shadows and warm parchment backdrop, readable on a 128x160 thumbnail. New facial silhouette and facial features specific to description. Vertical 4:5 head-and-shoulders crop, entire head/hair visible with 5% margin, face same scale as reference, slight three-quarter right view, upper-left light. No text, labels, border, weapon, full body, elaborate treasure equipment. Age and face are fictional design proposals not historical portrait reconstructions.

## 박술희

파일: `web/public/images/representatives/park-sulhui-portrait-v2.webp` · 5860바이트

프롬프트:

Use case: stylized-concept. Create ONE distinct fictional Korean historical-fantasy strategy game portrait: 박술희, game class 적병. Powerful rough frontline club fighter around 50, round-square face, very wide jaw, broad nose, thick uneven beard with a few gray hairs, heavy brows, knowing slightly crooked smile. Thick neck and massive clothed shoulders. Black tied hair under simple ochre band, plain heavy hemp robe and brown leather shoulder strap. No plate armor. Reference is ONLY a shared art-style example; DO NOT copy its face or costume. Hand-painted retro tactical RPG portrait with crisp dark contours, earthy limited colors, confident brush shadows and warm parchment backdrop, readable on a 128x160 thumbnail. New facial silhouette and facial features specific to description. Vertical 4:5 head-and-shoulders crop, entire head/hair visible with 5% margin, face same scale as reference, slight three-quarter right view, upper-left light. No text, labels, border, weapon, full body, elaborate treasure equipment. Age and face are fictional design proposals not historical portrait reconstructions.

## 최지몽

파일: `web/public/images/representatives/choe-jimong-portrait-v2.webp` · 4524바이트

프롬프트:

Use case: stylized-concept. Create ONE distinct fictional Korean historical-fantasy strategy game portrait: 최지몽, game class 도사. Slender mystical scholar around 30, long fine-boned face, high forehead, arching eyebrows, narrow contemplative eyes, clean shaven, delicate neck and sloping shoulders. Quiet dreamy serious expression. Long black hair neatly tied high with pale gray ribbon, plain charcoal robe with pale gray collar. No crown, no supernatural glow. Reference is ONLY a shared art-style example; DO NOT copy its face or costume. Hand-painted retro tactical RPG portrait with crisp dark contours, earthy limited colors, confident brush shadows and warm parchment backdrop, readable on a 128x160 thumbnail. New facial silhouette and facial features specific to description. Vertical 4:5 head-and-shoulders crop, entire head/hair visible with 5% margin, face same scale as reference, slight three-quarter right view, upper-left light. No text, labels, border, weapon, full body, elaborate treasure equipment. Age and face are fictional design proposals not historical portrait reconstructions.

## 견훤

파일: `web/public/images/representatives/gyeon-hwon-portrait-v2.webp` · 5634바이트

프롬프트:

Use case: stylized-concept. Create ONE distinct fictional Korean historical-fantasy strategy game portrait: 견훤, game class 군웅. Older formidable rival warlord around 58, broad rectangular face, heavy cheekbones, thick salt-and-pepper moustache and full short beard, wide forceful eyes, strong deep forehead creases, powerful neck and shoulders. Black-gray topknot, dark brown lamellar shoulders, muted bronze collar. Commanding and stern, no crown. Reference is ONLY a shared art-style example; DO NOT copy its face or costume. Hand-painted retro tactical RPG portrait with crisp dark contours, earthy limited colors, confident brush shadows and warm parchment backdrop, readable on a 128x160 thumbnail. New facial silhouette and facial features specific to description. Vertical 4:5 head-and-shoulders crop, entire head/hair visible with 5% margin, face same scale as reference, slight three-quarter right view, upper-left light. No text, labels, border, weapon, full body, elaborate treasure equipment. Age and face are fictional design proposals not historical portrait reconstructions.

## 신검

파일: `web/public/images/representatives/singeom-portrait-v2.webp` · 5354바이트

프롬프트:

Use case: stylized-concept. Create ONE distinct fictional Korean historical-fantasy strategy game portrait: 신검, game class 군웅. Ambitious adult royal warrior around 32, sharply tapered face, taut jaw, narrow slightly upturned eyes, fine thin moustache, little beard. Proud tense expression, athletic shoulders, black high topknot and muted violet tie, simple brown armor and dark purple collar. Clearly distinct from older broad-faced Gyeon Hwon. Reference is ONLY a shared art-style example; DO NOT copy its face or costume. Hand-painted retro tactical RPG portrait with crisp dark contours, earthy limited colors, confident brush shadows and warm parchment backdrop, readable on a 128x160 thumbnail. New facial silhouette and facial features specific to description. Vertical 4:5 head-and-shoulders crop, entire head/hair visible with 5% margin, face same scale as reference, slight three-quarter right view, upper-left light. No text, labels, border, weapon, full body, elaborate treasure equipment. Age and face are fictional design proposals not historical portrait reconstructions.

## 궁예

파일: `web/public/images/representatives/gung-ye-portrait-v2.webp` · 4914바이트

프롬프트:

Use case: stylized-concept. Create ONE distinct fictional Korean historical-fantasy strategy game portrait: 궁예, game class 서량기병. Intense mature cavalry ruler around 50, lean elongated face, shaved head, one eye closed with old healed scar and other eye sharply staring, deep cheek lines, no beard. Strong sinewy neck and square shoulders, dark plain lamellar armor over muted ochre robe. Severe austere expression. No stereotyped TV likeness, no fancy crown. Reference is ONLY a shared art-style example; DO NOT copy its face or costume. Hand-painted retro tactical RPG portrait with crisp dark contours, earthy limited colors, confident brush shadows and warm parchment backdrop, readable on a 128x160 thumbnail. New facial silhouette and facial features specific to description. Vertical 4:5 head-and-shoulders crop, entire head/hair visible with 5% margin, face same scale as reference, slight three-quarter right view, upper-left light. No text, labels, border, weapon, full body, elaborate treasure equipment. Age and face are fictional design proposals not historical portrait reconstructions.

## 경순왕

파일: `web/public/images/representatives/gyeongsun-portrait-v2.webp` · 4528바이트

프롬프트:

Use case: stylized-concept. Create ONE distinct fictional Korean historical-fantasy strategy game portrait: 경순왕, game class 황제. Refined young royal man around 28, small oval face, smooth narrow chin, soft straight eyebrows, worried thoughtful eyes, clean shaven, slim neck and modest shoulders. Neatly bound black hair under simple small black court cap, plain muted blue-gray robe with ivory collar. Dignity and vulnerability rather than muscular combat strength. Reference is ONLY a shared art-style example; DO NOT copy its face or costume. Hand-painted retro tactical RPG portrait with crisp dark contours, earthy limited colors, confident brush shadows and warm parchment backdrop, readable on a 128x160 thumbnail. New facial silhouette and facial features specific to description. Vertical 4:5 head-and-shoulders crop, entire head/hair visible with 5% margin, face same scale as reference, slight three-quarter right view, upper-left light. No text, labels, border, weapon, full body, elaborate treasure equipment. Age and face are fictional design proposals not historical portrait reconstructions.

## 왕륭

파일: `web/public/images/representatives/wang-ryung-portrait-v2.webp` · 4884바이트

프롬프트:

Use case: stylized-concept. Create ONE distinct fictional Korean historical-fantasy strategy game portrait: 왕륭, game class 민중. Older dignified father around 60, softly broad oval face, kindly downturned eyes, graying eyebrows, long narrow salt-and-pepper beard and moustache, gentle smile lines. Average build and relaxed shoulders, gray-black topknot under plain dark cloth headband, simple brown robe with cream collar. Experienced practical civilian, no armor. Reference is ONLY a shared art-style example; DO NOT copy its face or costume. Hand-painted retro tactical RPG portrait with crisp dark contours, earthy limited colors, confident brush shadows and warm parchment backdrop, readable on a 128x160 thumbnail. New facial silhouette and facial features specific to description. Vertical 4:5 head-and-shoulders crop, entire head/hair visible with 5% margin, face same scale as reference, slight three-quarter right view, upper-left light. No text, labels, border, weapon, full body, elaborate treasure equipment. Age and face are fictional design proposals not historical portrait reconstructions.


## 왕건 최종 얼굴 차별화 보정

기존 시안 대신 새 원화 사용. 3968바이트.

최종 프롬프트:

Single 왕건 portrait thumbnail for a Korean historical fantasy tactical RPG. Broad oval face with rounded cheeks and broad chin, wide-set kind eyes, soft curved eyebrows, small straight nose, neat rounded medium beard, forty-year-old composed compassionate leader. Gaze slightly LEFT of viewer, near-frontal face. Strong neck but relaxed shoulders. Black high topknot with navy tie, plain leather lamellar and navy collar. Calm closed mouth, absolutely no scowling brow. Traditional hand-painted late-1990s Korean tactical strategy game character portrait, finely brushed painted shading, crisp dark ink contour, warm muted ochres and dark brown shadows, realistic stylized anatomy, NOT photoreal or anime. Character head and shoulders only, vertical4:5, full topknot visible with margin, face occupies upper central65%, parchment beige background, upper-left light. Each facial feature must follow description. No text, weapons, border, full body, gold jewelry, crown. Fictional game character design.

## 유금필 최종 얼굴 차별화 보정

기존 시안 대신 새 원화 사용. 4012바이트.

최종 프롬프트:

Single 유금필 portrait thumbnail for a Korean historical fantasy tactical RPG. Long rugged asymmetrical angular face, broken-looking aquiline large nose, deeply tanned skin, squinting uneven eyes, one distinct vertical healed cheek scar, wide open confident grin showing a little teeth, heavy short stubble, broad handlebar-like short moustache. Forty-five-year-old muscular cavalry veteran. Near-frontal view looking LEFT. Black hair tight topknot with rust tie, plain dark brown leather armor. Traditional hand-painted late-1990s Korean tactical strategy game character portrait, finely brushed painted shading, crisp dark ink contour, warm muted ochres and dark brown shadows, realistic stylized anatomy, NOT photoreal or anime. Character head and shoulders only, vertical4:5, full topknot visible with margin, face occupies upper central65%, parchment beige background, upper-left light. Each facial feature must follow description. No text, weapons, border, full body, gold jewelry, crown. Fictional game character design.

## 배현경 최종 얼굴 차별화 보정

기존 시안 대신 새 원화 사용. 3970바이트.

최종 프롬프트:

Single 배현경 portrait thumbnail for a Korean historical fantasy tactical RPG. Compact broad face with flat broad nose, wide-set small focused eyes, thick horizontally straight brows, clean shaven jaw, single short thick moustache, medium-dark tan skin. Mature sturdy athletic mounted archer, square neck. Short practical black hair tied low, wide dark olive forehead cloth band. Almost frontal view. Brown leather shoulder armor and slate-green collar. Stoic slightly pursed lips. Traditional hand-painted late-1990s Korean tactical strategy game character portrait, finely brushed painted shading, crisp dark ink contour, warm muted ochres and dark brown shadows, realistic stylized anatomy, NOT photoreal or anime. Character head and shoulders only, vertical4:5, full topknot visible with margin, face occupies upper central65%, parchment beige background, upper-left light. Each facial feature must follow description. No text, weapons, border, full body, gold jewelry, crown. Fictional game character design.

## 신검 최종 얼굴 차별화 보정

기존 시안 대신 새 원화 사용. 3848바이트.

최종 프롬프트:

Single 신검 portrait thumbnail for a Korean historical fantasy tactical RPG. Very young adult man age 25, narrow heart-shaped face, pointed chin, smooth pale skin, thin slanted brows and large sharp eyes, clean shaven, NO moustache or beard. Proud faint smirk, slender athletic neck and shoulders, slight three-quarter LEFT view. Smooth black hair in tall tidy topknot with muted purple tie, plain leather armor and purple collar. Traditional hand-painted late-1990s Korean tactical strategy game character portrait, finely brushed painted shading, crisp dark ink contour, warm muted ochres and dark brown shadows, realistic stylized anatomy, NOT photoreal or anime. Character head and shoulders only, vertical4:5, full topknot visible with margin, face occupies upper central65%, parchment beige background, upper-left light. Each facial feature must follow description. No text, weapons, border, full body, gold jewelry, crown. Fictional game character design.

검증: 17명 매핑·파일 존재 확인, 원본 characters.json 변경 없음, 경량본 14종 128×160 육안 확인. 이번 생성 원본 18개(첫 시안14+보정4)는 경량본 검증 후 삭제. 기존 이전 버전은 보존.

최종 결과: 신규14종 69,300바이트, 기존3종 포함17종 85,206바이트. 웹 빌드 통과, 브라우저 실존 인물17명 필터·새 초상화 표시 확인. 커밋·푸시·배포 미실행.
