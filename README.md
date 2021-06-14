# Lace Explorer（v0.1.x）
（現状は突貫工事版で、バージョン1にするまでにはゴリゴリのリファクタリングをするつもりです）

セルとセルを関連付けて表示・再生できる、個人レベルのデータ分析用のメディアエクスプローラーです。創作物の分析に使うような用途をイメージしてます。

<br><br>

# なぜ作ったかを書きたいだけの長文

例えば音楽を分析したい時、以下の情報をまとめたくなったりするとします。

- 技法を言葉で表したもの
- その技法を使っているアーティスト名、曲名のリスト
- その技法を使える場所のリスト（イントロなのかAメロなのかの大きなセクション、イントロの最初なのか最後なのかのより小さなセクション等）
- その技法を使える楽器タイプのリスト（打楽器の技法なのか、音階楽器の技法なのか、ピアノでしか使えない技法なのかコード楽器全般で使える技法なのか、上モノ用の技法なのかベース用の技法なのか等）
- その技法を使ったら醸し出される雰囲気のリスト（暗くなるのか明るくなるのか、癒やされるのかノリが出るのか等。一つじゃなく複数ありうる）
- etc

音楽に限らず、創作技法はごちゃまぜに「明るくなるやつ」「ベースでしか使えないやつ」などの一緒くたにまとめても参照性が悪いのでフィルタリングかけたくなると思います。さらに、単にRDBやテキストにまとめてるだけだとそのままメディアを再生できません。しかも「同じ技法を使っている曲リスト」は、テキストファイルだとどんどんコピペすることになり、まとめビリティも低いです。とにかくそういう創作技法をまとめる/参照するためのツールでよいものがまだ無い気がしました。自分の趣味が興味あることの作り方の情報をまとめることなので、それ用の良いツールが無い現状を鑑みてこれは作るしかないかなとなって作り始めた感じです。メディアはそのまま再生、関連データはすぐ表示、フィルタリング簡単、マークダウンもOKです。しいて言えば難点は現状のインフラ面のアーキテクチャでリファクタリングしたいです。

例えば創作する時は「暗い感じの雰囲気にしたい」とかあると思います。その時、暗い雰囲気になる要素を参照したくなると思いますがそういう時に使えます。現状そんな都合いいソフトが無いんですよね。あったとしてもトップダウン方式にしかまとめられないNotionのようなものや、関連を表せるけどとても見づらいノードエディタのようなものや、なんでもできるけどコーディングをゴリゴリしないといけないRDBみたいなものしかない。しかもわりとメディアを再生できないかったりするんですよね。または特定のデータにのみフィットするアプリケーションを作るしか無い。趣味が音楽だけならいいですが、絵や物語もまとめたい場合、ビジネスアイデア分析したいとかの場合になると破綻するような。そういうのは非理想的なので、とにかくどんな用途でも使えるメディアエクスプローラーがほしかったです。

他あれこれはバージョン1ができてから…

<br>

# インストーラ（v0.1.x）
Windows x64版のみアップロードしてます。
https://github.com/lainNao/Lace/releases

こちらのリンク先にあるバージョンが新しいやつの「vX.X.X-Win-x64.zip」をなんとかDLし、中の「Lace Explorer Setup <そのバージョン番号>.exe」をクリックでインストールできます。

ちなみにv1未満は「まだ製品レベルのものではない＆製品レベルのちゃんとしたテストなどをしていない」ということなのでそこらへんお願いします、。

<br>

# 現機能
- データ登録機能（テキスト、マークダウン、音声ファイル、動画ファイル、画像ファイル）
- データ再生機能（テキスト描画、マークダウンプレビュー、音声再生、動画再生、画像表示）
- データ同士の関連付け機能
- 関連付いたデータを見やすく表示する機能
- データを簡単にフィルタリングする機能

<br>

# WIP
- かなりリファクタリングしたい
- テスト

<br>

# 免責
※バグって変な動作しても業界3年目の駆け出し終わりかけプログラマーは責任負えません…お互い頑張って生きましょう…
