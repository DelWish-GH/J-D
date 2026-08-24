(function() {
    'use strict';

    const rawNames = [
        "小栗操","朝妃莉緒","清野咲","白峰美羽","香川杏","三雲彩葉","白石茉莉奈","皆瀨明里","竹内有紀","月野江翠","三葉千春","月乃露娜","釋愛麗絲","幸村泉希","天音流菜","日高由愛","田村香奈","松岡美櫻","白石麻友","春日日音","與田鈴","山石麻衣香","井上桃",
        "篠宮留衣","東條夏","根尾明里","久遠美緒","矢埜愛茉","櫻美櫻","倉本蓳","一宮留衣","柴崎春","明里紬","宮下玲奈","虹村由美","森彩美","黑咲華","天音蜜雪兒","鈴河惠","小倉美希音","夢實香苗","白石純","石川澪","逢澤美優","月神花梨","京本晴美","佐佐木明希",
        "花守夏步","尾崎惠梨香","小那海綾","望實佳苗","真宮詩織","七瀨愛麗絲","七森莉莉","千石萌奈果","足立友梨","安野由美","林芽依","安西澪","甘夏唯","白森胡桃","桐岡皐月","美之邊沙也加","朝宮來奈","古川穗花","石田紗季","天馬由衣","鳳美優","松本一香","辻美衣奈",
        "初美菜乃花","七瀨温","多田有花","夏目彩春","野野浦暖","中森七海","八掛海","吉永塔子","馬場紗奈","花狩舞","春陽萌花","二宮桃","小野六花","百瀨飛鳥","横宮七海","早見奈奈","紺野光","花宮麗","玉木久留美","市川愛茉","黑川紗里奈","山井鈴","大浦真奈美",
        "成澤妃","葉月萌","愛乃零","南乃空","明海香","廣仲南","未步奈奈","八木奈奈","渚愛梨","榊原萌","結城希","水戶香奈","篠崎沙帆","結城花乃羽","仲村美羽","古東真理子","天使萌","明日葉三葉","白上咲花","日向夏","瀧本雫葉","美咲園香","美咲佳奈","花咲澪","藤咲舞",
        "瀨緒凜","北川遥","響蓮","唯井真尋","青空光","宮島芽衣","新川空","天川空","綾瀨天","淺野心","河北彩花","河北彩伽","倉木華","園梨音","本庄鈴","佐久間津奈","音無鈴","大島優香","葵百合香","木戶薫","渚戀生","兒玉七海","白石透羽","佐佐倉日和",
        "谷村凪咲","葉月保奈美","愛才莉亞","瀨緒凛","白石奈美","輝星綺羅","石川胡桃","北岡果林","佐藤愛瑠","雪奈真冬","前田美波","柏木雫","巴煇","凰華鈴","小早川怜子","生田紗奈","新木希空","三田真鈴","小松本果","新垣美琉","川口櫻","Maria Valentine"
    ];

    // ── 檢查並打印重複人名 ──────────────────────────────────────
    const nameCount = {};
    rawNames.forEach(name => {
        nameCount[name] = (nameCount[name] || 0) + 1;
    });

    const duplicateList = Object.entries(nameCount)
        .filter(([_, count]) => count > 1)
        .map(([name, count]) => `• ${name} (出現 ${count} 次)`);

    if (duplicateList.length > 0) {
        console.warn(`[過濾腳本] ⚠️ 發現重複人名 (${duplicateList.length} 組)，請手動刪除：\n` + duplicateList.join('\n'));
    } else {
        console.log(`[過濾腳本]  名單檢查正常，無任何重複人名（共 ${rawNames.length} 人）。`);
    }

    // 建立 Set 提升比對效能（自動去重）
    const filterNamesSet = new Set(rawNames);

    function shouldHide(title) {
        // 依照空格分段：第 0 段為片名，後續段落皆為人名
        const parts = title.trim().split(/\s+/);
        
        // 沒有任何空格（無人名標註）-> 不隱藏
        if (parts.length < 2) return false;

        const names = parts.slice(1);

        // 特殊處理自帶空格的英文藝名 (例如 "Maria Valentine")
        const fullRemainingName = names.join(' ');
        if (filterNamesSet.has(fullRemainingName)) {
            return true; // 單人作品且命中黑名單 -> 隱藏
        }

        // 超過 1 個空格分段 -> 代表有多位人名 (多人合作) -> 保留不隱藏
        if (names.length > 1) {
            return false;
        }

        // 單一人名 -> 比對是否在名單內
        const singleName = names[0];
        return filterNamesSet.has(singleName);
    }

    function filterCards() {
        const cards = document.querySelectorAll('.col-6.col-sm-4.col-lg-3');
        cards.forEach(card => {
            const titleElement = card.querySelector('.title a');
            if (titleElement) {
                const titleText = titleElement.innerText;
                if (shouldHide(titleText)) {
                    card.style.display = 'none';
                }
            }
        });
    }

    function initObserver() {
        const observerTarget = document.getElementById('site-content') || document.body;
        
        if (!observerTarget || (observerTarget === document.body && !document.getElementById('site-content'))) {
            setTimeout(initObserver, 50);
            return;
        }

        if (window.jableObserver) window.jableObserver.disconnect();
        
        window.jableObserver = new MutationObserver(() => {
            filterCards();
        });

        window.jableObserver.observe(observerTarget, { childList: true, subtree: true });
        filterCards();
        console.log('[過濾腳本] 篩選器與監聽器已安全啟動成功');
    }

    initObserver();
})();
