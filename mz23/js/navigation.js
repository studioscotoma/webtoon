/**
 * ナビゲーションエリアを動的に生成する関数
 * @param {number} currentEp - 現在のエピソード番号 (例: 4)
 * @param {number} totalEp   - 現在公開されている最新エピソード番号 (例: 5)
 */
function renderNavigation(currentEp, totalEp) {
    const container = document.getElementById('navigation-placeholder');
    if (!container) return;

    // ゼロ埋めヘルパー (1 -> '001')
    const pad = (num) => String(num).padStart(3, '0');
    
    // 次のエピソード番号
    const nextEp = currentEp + 1;
    const prevEp = currentEp - 1;
    const hasNext = nextEp <= totalEp;
    const hasPrev = prevEp >= 1;

    let html = '';

    // --- 1. Next Episode Area (大きな次へボタン) ---
    // 次の話が存在する場合のみ表示、なければ「最新話」などの表示にするか非表示
    if (hasNext) {
        html += `
        <div class="next-episode-area">
            <a href="ep${pad(nextEp)}.html" class="next-button">
                <span class="next-label">Next Operation</span>
                <span class="next-title">EPISODE ${pad(nextEp)}</span>
            </a>
        </div>`;
    } else {
        // 最新話の場合の表示（必要なら）
        html += `
        <div class="next-episode-area">
            <div class="next-button disabled" style="opacity:0.5; cursor:default;">
                <span class="next-label">Current Latest</span>
                <span class="next-title">TO BE CONTINUED...</span>
            </div>
        </div>`;
    }

    // --- 2. Nav Footer (前後リンクとドロップダウン) ---
    html += `<div class="nav-footer">`;

    // PREVリンク
    if (hasPrev) {
        html += `<a href="ep${pad(prevEp)}.html" class="nav-link">&lt; PREV</a>`;
    } else {
        html += `<span class="nav-link" style="visibility:hidden">&lt; PREV</span>`; // レイアウト崩れ防止のダミー
    }

    // ドロップダウンリスト
    html += `<div class="ep-select-wrapper">
                <select onchange="if(this.value) location.href=this.value">`;
    
    // 全エピソード分ループしてoptionを生成
    for (let i = 1; i <= totalEp; i++) {
        const isSelected = (i === currentEp) ? 'selected' : '';
        html += `<option value="ep${pad(i)}.html" ${isSelected}>EP.${String(i).padStart(2, '0')}</option>`;
    }
    
    html += `   </select>
             </div>`;

    // STUDIOリンク (固定)
    html += `<a href="../index.html" class="nav-link">STUDIO &gt;</a>`;
    html += `</div>`; // end nav-footer

    // HTMLを注入
    container.innerHTML = html;
}