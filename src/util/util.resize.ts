function addResizeEvent(el: HTMLElement) {
    const resizerList = el.querySelectorAll('.resizer')
    // 창크기 최소 사이즈(가로/세로)
    const minimum_size = 100

    let origin_width = 0;
    let origin_height = 0;
    let origin_x = 0;
    let origin_y = 0;
    let origin_mouse_x = 0;
    let origin_mouse_y = 0;

    // 8방향에 대한 이벤트 등록
    for(let i = 0, len = resizerList.length; i < len; i++) {
        const currentResizer = resizerList[i]
        // @ts-ignore
        currentResizer.addEventListener('mousedown', (e: MouseEvent) => {
            e.preventDefault()

            // 변경전 크기
            origin_width = el.getBoundingClientRect().width
            origin_height = el.getBoundingClientRect().height

            // 변경전 엘리먼트 시작점 (left, top)
            origin_x = el.getBoundingClientRect().left;
            origin_y = el.getBoundingClientRect().top;

            // 변경전 마우스 좌표
            origin_mouse_x = e.pageX;
            origin_mouse_y = e.pageY;

            // 리사이즈 이벤트 등록
            window.addEventListener('mousemove', resize)
            window.addEventListener('mouseup', stopResize)
        })

        /**
         * 리사이즈 처리
         */
        function resize(e: MouseEvent) {

            if(currentResizer.classList.contains('bottom-right')) {
                // 남동
                const width = origin_width + (e.pageX - origin_mouse_x)
                const height = origin_height + (e.pageY - origin_mouse_y)
                if (width > minimum_size) {
                    el.style.width = width + 'px'
                }
                if (height > minimum_size) {
                    el.style.height = height + 'px'
                }

            } else if (currentResizer.classList.contains('bottom-middle')) {
                // 남
                const height = origin_height + (e.pageY - origin_mouse_y)
                if (height > minimum_size) {
                    el.style.height = height + 'px'
                }

            } else if(currentResizer.classList.contains('bottom-left')) {
                // 남서
                const width = origin_width - (e.pageX - origin_mouse_x)
                const height = origin_height + (e.pageY - origin_mouse_y)
                if (height > minimum_size) {
                    el.style.height = height + 'px'
                }
                if (width > minimum_size) {
                    el.style.width = width + 'px'
                    el.style.left = origin_x + (e.pageX - origin_mouse_x) + 'px'
                }
            } else if (currentResizer.classList.contains('middle-left')) {
                // 서
                const width = origin_width - (e.pageX - origin_mouse_x)
                if (width > minimum_size) {
                    el.style.width = width + 'px'
                    el.style.left = origin_x + (e.pageX - origin_mouse_x) + 'px'
                }

            } else if(currentResizer.classList.contains('middle-right')) {
                // 동
                const width = origin_width + (e.pageX - origin_mouse_x)
                if (width > minimum_size) {
                    el.style.width = width + 'px'
                }

            } else if(currentResizer.classList.contains('top-right')) {
                // 동북
                const width = origin_width + (e.pageX - origin_mouse_x)
                const height = origin_height - (e.pageY - origin_mouse_y)
                if (width > minimum_size) {
                    el.style.width = width + 'px'
                }
                if (height > minimum_size) {
                    el.style.height = height + 'px'
                    el.style.top = origin_y + (e.pageY - origin_mouse_y) + 'px'
                }

            } else if(currentResizer.classList.contains('top-middle')) {
                // 북
                const height = origin_height - (e.pageY - origin_mouse_y)
                if (height > minimum_size) {
                    el.style.height = height + 'px'
                    el.style.top = origin_y + (e.pageY - origin_mouse_y) + 'px'
                }

            } else if(currentResizer.classList.contains('top-left')) {
                // 서북
                const width = origin_width - (e.pageX - origin_mouse_x)
                const height = origin_height - (e.pageY - origin_mouse_y)
                if (width > minimum_size) {
                    el.style.width = width + 'px'
                    el.style.left = origin_x + (e.pageX - origin_mouse_x) + 'px'
                }
                if (height > minimum_size) {
                    el.style.height = height + 'px'
                    el.style.top = origin_y + (e.pageY - origin_mouse_y) + 'px'
                }

            }
        }

        /**
         * 리사이즈 이벤트 제거
         */
        function stopResize() {
            window.removeEventListener('mousemove', resize)
        }
    }
}

export { addResizeEvent }