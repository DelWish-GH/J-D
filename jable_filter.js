(function() {
    'use strict';

    const rawNames = [
        "小栗操","朝妃莉緒","清野咲","白峰美羽","香川杏","三雲彩葉","白石茉莉奈","皆瀨明里","竹内有紀","月野江翠","三葉千春","月乃露娜","釋愛麗絲","幸村泉希","天音流菜","日高由愛","田村香奈","松岡美櫻","白石麻友","春日日音","與田鈴","山石麻衣香","井上桃",
        "篠宮留衣","東條夏","根尾明里","久遠美緒","矢埜愛茉","櫻美櫻","倉本蓳","一宮留衣","柴崎春","明里紬","宮下玲奈","虹村由美","森彩美","黑咲華","天音蜜雪兒","鈴河惠","小倉美希音","夢實香苗","白石純","石川澪","逢澤美優","月神花梨","京本晴美","佐佐木明希",
        "花守夏步","尾崎惠梨香","小那海綾","望實佳苗","真宮詩織","七瀨愛麗絲","七森莉莉","千石萌奈果","足立友梨","安野由美","林芽依","安西澪","甘夏唯","白森胡桃","桐岡皐月","美之邊沙也加","朝宮來奈","古川穗花","石田紗季","天馬由衣","鳳美優","松本一香","辻美衣奈",
        "初美菜乃花","七瀨温","多田有花","夏目彩春","野野浦暖","中森七海","八掛海","吉永塔子","馬場紗奈","花狩舞","春陽萌花","二宮桃","小野六花","百瀨飛鳥","横宮七海","早見奈奈","紺野光","花宮麗","玉木久留美","市川愛茉","黑川紗里奈","山井鈴","大浦真奈美",
        "成澤妃","葉月萌","愛乃零","南乃空","明海香","廣仲南","未步奈奈","八木奈奈","渚愛梨","榊原萌","結城希","水戶香奈","篠崎沙帆","結城花乃羽","仲村美羽","古東真理子","天使萌","明日葉三葉","白上咲花","日向夏","瀧本雫葉","美咲園香","美咲佳奈","花咲澪","藤咲舞",
        "瀨緒凜","北川遥","響蓮","唯井真尋","青空光","宮島芽衣","新川空","天川空","綾瀨天","淺野心","河北彩花","河北彩伽","倉木華","園梨音","本庄鈴","佐久間津奈","音無鈴","大島優香","葵百合香","木戶薫"
    ];

    const filterNames = [...new Set(rawNames)];

    // 印出目前過濾名單資訊與完整陣列內容
    console.log(`[遠端腳本] 目前載入名單共 ${rawNames.length} 人（去重後 ${filterNames.length} 人）：`, rawNames);

    function shouldHide(title, name) {
        if (!title.includes(name)) return false;

        const otherNamesFound = filterNames.filter(n => n !== name && title.includes(n));
        if (otherNamesFound.length > 0) return false;

        const parts = title.trim().split(/\s+/);
        const nameIndex = parts.indexOf(name);

        if (nameIndex !== -1) {
            const blacklistKeywords = ['中出', '無套', '巨乳', '解禁', '新人', '作品', '限定', '特別', '完全'];
            if (nameIndex > 0) {
                const prevPart = parts[nameIndex - 1];
                if (prevPart.length >= 2 && prevPart.length <= 5 &&
                    !blacklistKeywords.some(k => prevPart.includes(k)) &&
                    !/[A-Z0-9:-]+/i.test(prevPart)) {
                    return false; 
                }
            }
            if (nameIndex < parts.length - 1) {
                return false; 
            }
        }
        return true;
    }

    function filterCards() {
        const cards = document.querySelectorAll('.col-6.col-sm-4.col-lg-3');
        cards.forEach(card => {
            const titleElement = card.querySelector('.title a');
            if (titleElement) {
                const titleText = titleElement.innerText;
                filterNames.forEach(name => {
                    if (shouldHide(titleText, name)) {
                        card.style.display = 'none';
                    }
                });
            }
        });
    }

    // 核心修正：動態輪詢等待網頁元素完全出現，防止 Node 為 null 導致崩潰
    function initObserver() {
        const observerTarget = document.getElementById('site-content') || document.body;
        
        if (!observerTarget || (observerTarget === document.body && !document.getElementById('site-content'))) {
            // 如果還沒載入到 site-content，過 50 毫秒再試一次
            setTimeout(initObserver, 50);
            return;
        }

        if (window.jableObserver) window.jableObserver.disconnect();
        
        window.jableObserver = new MutationObserver(() => {
            filterCards();
        });

        window.jableObserver.observe(observerTarget, { childList: true, subtree: true });
        filterCards();
        console.log('[遠端腳本] 篩選器與監聽器已安全啟動成功');
    }

    initObserver();
})();
