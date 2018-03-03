# njk-html
Nunjucksテンプレートを静的HTMLファイルにコンパイルする為のNodeモジュールです。  
拡張子が html のファイルが対象です。  
ファイル名が '_'(アンダースコア) で始まるファイルは出力されません。  
オプション `--watch` が有効の場合、アンダースコアで始まるファイルを更新すると全ての対象ファイルをコンパイルします(Nunjucksのextend、icludeに対応するため)。

## Install
```json:package.json
"dependencies": {
  "njk-html": "https://github.com/mada-nemui/njk-html.git"
}
```
## Usage
```shell
node node_modules/njk-html [Options]
```
```
Options:
-p, --path       ソースのディレクトリを指定します (default: './')
-o, --out        出力先のディレクトリを指定します (default: './out-html')
-c, --use-cache  Nunjucksの'noCache'オプションにfalseをセットします (default: true)
-w, --watch      Nunjucksの'watch'オプションにtrueをセットします (default: false)
```