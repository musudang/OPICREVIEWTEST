// 유튜브 공식 embed(iframe) 방식으로 영상을 재생한다. 영상을 다운로드/추출하지 않고
// 유튜브 서버에서 그대로 스트리밍하는 방식이라 저작권 문제가 없다.
const VIDEO_ID = 'Bd4tU4oL2_4'

interface Props {
  onClose: () => void
}

export default function YouTubeAmbientPopup({ onClose }: Props) {
  return (
    <div className="yt-popup">
      <div className="yt-popup-header">
        <span>배경 영상 (사람 말소리)</span>
        <button type="button" className="yt-popup-close" onClick={onClose} aria-label="닫기">
          ✕
        </button>
      </div>
      <iframe
        width="280"
        height="158"
        src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}`}
        title="배경 영상"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  )
}
