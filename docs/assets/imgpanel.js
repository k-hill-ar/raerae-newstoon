/* 이미지개선편: 나노바나나가 그린 그림을 컷에 넣는다. newstoon.js 다음에 불러온다.
   사용: { svg: imgPanel('p1'), html: `말풍선…` }  /  넓은 컷: imgPanel('p1', 400, 200)
   그림(docs/SLUG/img/p1.jpg)이 아직 없으면 '그리는 중' 안내가 보이고, 생기면 칸을 꽉 채운다. */
function imgPanel(id, w = 400, h = 300) {
  const small = Math.min(w, h) < 250;
  return `<rect width="${w}" height="${h}" fill="#e6eef8"/>
    <text x="${w / 2}" y="${h * 0.56}" font-family="Jua" font-size="${small ? 15 : 20}" text-anchor="middle" fill="#5b6b7e">🎨 그림을 그리는 중이에요</text>
    <text x="${w / 2}" y="${h * 0.56 + (small ? 22 : 28)}" font-family="Jua" font-size="${small ? 12 : 15}" text-anchor="middle" fill="#8a96a8">잠시 뒤 새로고침해 주세요</text>
    <image href="img/${id}.jpg" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" onerror="this.remove()"/>`;
}
