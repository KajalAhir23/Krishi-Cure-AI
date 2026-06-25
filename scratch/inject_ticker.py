import os

pages = [
    r'd:\krishi_cure\public\index.html',
    r'd:\krishi_cure\public\symptoms.html',
    r'd:\krishi_cure\public\result.html',
    r'd:\krishi_cure\public\upload.html',
    r'd:\krishi_cure\public\fertilizer-calculator.html',
    r'd:\krishi_cure\public\diagnosis-choice.html',
    r'd:\krishi_cure\public\login.html',
]

TAG_OLD = '<script src="/js/app.js"></script>'
TAG_NEW = '<script src="/js/app.js"></script>\n    <script src="/js/status-ticker.js"></script>'

for path in pages:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'status-ticker.js' in content:
        print('SKIP (already): ' + os.path.basename(path))
    elif TAG_OLD in content:
        new_content = content.replace(TAG_OLD, TAG_NEW, 1)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('OK: ' + os.path.basename(path))
    else:
        print('ERROR no app.js: ' + os.path.basename(path))
