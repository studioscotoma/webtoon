
/**
 * Glitch Webtoon Viewer Core
 * 基本機能（表紙制御、画像レンダリング、字幕生成）を提供
 */
class GlitchViewer {
    constructor(config) {
        // 設定のデフォルト値とマージ
        this.config = Object.assign({
            debugMode: false,
            filePrefix: '',     // 例: 'ep001/scene'
            fileExtension: '.webp',
            containerId: 'comic-content',
            coverId: 'cover-screen',
            viewerId: 'viewer-container',
            startBtnId: 'start-button'
        }, config);

        // DOM要素の取得
        this.container = document.getElementById(this.config.containerId);
        this.cover = document.getElementById(this.config.coverId);
        this.viewer = document.getElementById(this.config.viewerId);
        this.startBtn = document.getElementById(this.config.startBtnId);

        // 特殊タイプ（ゲームなど）用のレンダラー保持場所
        this.customRenderers = {};
    }

    /**
     * 特殊シーン（game等）の描画関数を登録するメソッド
     * @param {string} type - シナリオデータの type 値 (例: 'game')
     * @param {function} renderFn - DOM要素を返す関数
     */
    registerType(type, renderFn) {
        this.customRenderers[type] = renderFn;
    }

    /**
     * ビューワーの初期化と開始
     * @param {Array} scenarioData - シナリオデータの配列
     */
    init(scenarioData) {
        if (this.config.debugMode) {
            console.log("🔧 Debug Mode: Skipping cover.");
            this.start();
        } else {
            if(this.startBtn) {
                this.startBtn.addEventListener('click', () => this.start());
            }
        }
        this.render(scenarioData);
    }

    // 本編開始処理
    start() {
        if(this.cover) this.cover.classList.add('hidden');
        if(this.viewer) this.viewer.classList.add('active');
        window.scrollTo(0, 0);
    }

    // メインレンダリング処理
    render(data) {
        const fragment = document.createDocumentFragment();
        let imageCounter = 1;

        data.forEach(scene => {
            const sceneBlock = document.createElement('div');
            sceneBlock.className = 'scene-block';

            // 1. 特殊タイプ（ゲーム等）の判定
            if (scene.type && this.customRenderers[scene.type]) {
                const customElem = this.customRenderers[scene.type](scene);
                if (customElem) sceneBlock.appendChild(customElem);
                
            } else {
                // 2. 通常タイプ（画像）
                // type指定がない、または 'image' の場合は画像を生成
                sceneBlock.appendChild(this._createImageElement(scene, imageCounter));
                imageCounter++;
            }
            
            fragment.appendChild(sceneBlock);
        });

        this.container.appendChild(fragment);
    }

    // 内部メソッド：画像と字幕の生成
    _createImageElement(scene, counter) {
        const wrapper = document.createDocumentFragment();
        
        // --- 画像生成 ---
        const fileNum = (scene.id || counter).toString().padStart(2, '0');
        const img = document.createElement('img');
        img.className = 'comic-image';
        img.loading = 'lazy';
        img.alt = `Scene ${fileNum}`;
        
        // 画像パス生成 (sceneオブジェクトにsrcがある場合はそれを優先、なければ連番生成)
        if (scene.src) {
            img.src = scene.src;
        } else {
            img.src = `${this.config.filePrefix}${fileNum}${this.config.fileExtension}`;
        }

        // エラーハンドリング
        img.onerror = function() {
            this.src = `https://placehold.co/690x800/111/fff?text=Scene+${fileNum}`;
            this.onerror = null;
        };
        wrapper.appendChild(img);

        // --- 字幕生成 ---
        // テキストデータがある場合のみ生成
        if (scene.kr || scene.ja || scene.en || scene.fr) {
            const captionDiv = document.createElement('div');
            captionDiv.className = 'caption-area';
            
            const appendText = (cls, text) => {
                if (!text) return;
                const p = document.createElement('p');
                p.className = cls;
                p.innerHTML = text;
                captionDiv.appendChild(p);
            };

            appendText('text-ja', scene.ja);
            appendText('text-kr', scene.kr);
            appendText('text-fr', scene.fr);
            appendText('text-en', scene.en);
            
            wrapper.appendChild(captionDiv);
        }

        return wrapper;
    }
}