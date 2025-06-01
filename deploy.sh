npm run build

# 移動至到打包後的靜態產品目錄 
cd dist

# 讓github page重新整理正常(沒有複製則會到github的預設404 page)
cp index.html 404.html

# deploy編譯後的檔案名為亂數，由於檔名不重複會無限增多檔案
# 因此在進入資料夾後先初始化git
git init 
git add -A
git commit -m 'Deploy'


# 申請GitHub Personal access tokens，記得不要將這個檔案推到git，token會暴露
# 將 dist資料夾中的內容推送至遠端github-pages分支中
# 並強制無條件將舊有的內容取代成目前的內容（指令 git push -f)

git push -f github-pages
cd -
# 在.gitignore中增加 /resume-202209
