/**
 * 드래그 이벤트 등록
 * @param el
 */
function addDragEvent(el: HTMLElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0

    // 메시지 박스 헤더에 이벤트 등록
    const header = el.getElementsByClassName('drag-box')[0] as HTMLElement
    header.onmousedown = dragMouseDown

    /**
     * 마우스 버튼 누를때 관련 이벤트 등록
     * - onmouseup   : 이벤트 초기화
     * - onmousemove : 드래그 이벤트 등록
     *
     * @param e
     */
    function dragMouseDown(e: MouseEvent) {
        e.preventDefault()

        // 이벤트 발생 좌표
        pos3 = e.clientX
        pos4 = e.clientY

        document.onmousemove = elementDrag
        document.onmouseup = closeDragElement
    }

    /**
     * 드래그를 통한 위치이동
     *
     * @param e
     */
    function elementDrag(e: MouseEvent) {
        e.preventDefault()

        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY

        const posTop = el.offsetTop - pos2
        const posLeft = el.offsetLeft - pos1

        el.style.top = (posTop > 0 ? posTop : 0) + 'px'
        el.style.left = (posLeft > 0 ? posLeft : 0) + 'px'
    }

    /**
     * 드래그 이벤트 해제
     */
    function closeDragElement() {
        document.onmouseup = null
        document.onmousemove = null
    }
}

export { addDragEvent }