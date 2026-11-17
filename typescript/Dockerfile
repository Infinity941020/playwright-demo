# Playwright公式のNode + Chromium + 依存入りベースイメージ
FROM mcr.microsoft.com/playwright:v1.49.0-jammy

# コンテナ内の作業ディレクトリを/appに設定
WORKDIR /app

# package.json / package-lock.jsonを先にコピー（キャッシュ効率化のため）
COPY package*.json ./

# npm依存関係をインストール
RUN npm ci

# ソースコード全体をコンテナにコピー
COPY . .

# ===== ここが重要：Visual Regression安定化用フォント追加 =====

# 日本語・英語の描画差分を防ぐためNotoフォントを追加
# fontconfigはフォントキャッシュ管理用
RUN apt-get update && apt-get install -y \
    fonts-noto \
    fonts-noto-cjk \
    fonts-dejavu \
    fontconfig \
    && fc-cache -fv

# Playwrightのブラウザ依存関係をインストール（コンテナ環境用）
RUN npx playwright install --with-deps

# テスト実行コマンド（デフォルト）
CMD ["npx", "playwright", "test"]