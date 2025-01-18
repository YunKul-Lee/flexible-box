function setPosition(el: HTMLElement, direction: 'top' | 'bottom' | 'left' | 'right' | 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom' | 'center' | undefined) {
    if(direction) {
        const verticalDirectionPos = (document.documentElement.clientHeight - el.getBoundingClientRect().height) / 2
        const horizontalDirectionPos = (document.documentElement.clientWidth - el.getBoundingClientRect().width) / 2

        console.log(direction)
        console.log(horizontalDirectionPos)
        console.log(document.documentElement.clientWidth)
        console.log(el.getBoundingClientRect().height)

        switch (direction) {
            case "left":
                el.style.left = '0px'
                el.style.top = `${verticalDirectionPos}px`
                break
            case "right":
                el.style.right = '0px'
                el.style.top = `${verticalDirectionPos}px`
                break
            case "top":
                el.style.top = '0px'
                el.style.left = `${horizontalDirectionPos}px`
                break
            case "bottom":
                el.style.bottom = '0px'
                el.style.left = `${horizontalDirectionPos}px`
                break
            case "left-top":
                el.style.top = '0px'
                el.style.left = '0px'
                break
            case "right-top":
                el.style.right = '0px'
                el.style.top = '0px'
                break
            case "left-bottom":
                el.style.left = '0px'
                el.style.bottom = '0px'
                break
            case "right-bottom":
                el.style.right = '0px'
                el.style.bottom = '0px'
                break
            case "center":
                el.style.left = `${horizontalDirectionPos}px`
                el.style.top = `${verticalDirectionPos}px`
                break
        }
    }
}

export { setPosition }