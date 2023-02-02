
const flLightbox = () => {

    const lightboxes = document.querySelectorAll('.fl-lightbox');

    const lightbox = (con) => {

        // variables
        const items = con.querySelectorAll('.fl-lightbox-item');
        const images = con.querySelectorAll('.fl-lightbox-img');
        const length = images.length;
        const lastIndex = length - 1;
        let nextIndex = 1;
        let prevIndex = lastIndex;
        let sources = [], modal, list, indexes, previewImgWrapper, previewImg, 
        prevArrow, nextArrow, closeBtn, zoomInBtn, zoomOutBtn, 
        rotateLeftBtn, rotateRightBtn, rotateLoop = 0; zoomLoop = 1;

        // functions
        const createSources = () => { 
            images.forEach((img) => { sources.push(img.getAttribute('src')) 
        })}
        
        const createModal = () => {

            modal = createElement('div',"", {class: "fl-lightbox-modal" }, document.body);
            list = createElement('div',"", {class: "fl-lightbox-list" }, modal);
            indexes = createElement('div',"", {class: "fl-lightbox-indexes" }, list);
            prevArrow = createElement("button","<i class='fa fa-chevron-left'></i>", { class: "fl-lightbox-arrow fl-lightbox-prev", type: "button"}, modal);
            nextArrow = createElement("button","<i class='fa fa-chevron-right'></i>", { class: "fl-lightbox-arrow fl-lightbox-next", type: "button"}, modal);
            rotateLeftBtn = createElement("button","<i class='fa fa-undo'></i>", { class: "fl-lightbox-rotate-left fl-lightbox-btn", type: "button"}, list);
            rotateRightBtn = createElement("button","<i class='fa fa-repeat'></i>", { class: "fl-lightbox-rotate-right fl-lightbox-btn", type: "button"}, list);
            zoomOutBtn = createElement("button","<i class='fa fa-search-minus'></i>", { class: "fl-lightbox-zoom-out fl-lightbox-btn disabled", type: "button"}, list);
            zoomInBtn = createElement("button","<i class='fa fa-search-plus'></i>", { class: "fl-lightbox-zoom-in fl-lightbox-btn", type: "button"}, list);
            closeBtn = createElement("button","<i class='fa fa-times'></i>", { class: "fl-lightbox-close fl-lightbox-btn", type: "button"}, list);
            previewImgWrapper = createElement('div',"", {class: "fl-lightbox-preview-img-wrapper" }, modal);
            previewImg = createElement('img',"", {class: "fl-lightbox-preview-img" }, previewImgWrapper);
            previewImg.setAttribute('src', sources[0]);

            modal.addEventListener('click', closeModal);
            modal.addEventListener('wheel', wheelZoom);
            list.addEventListener('click', (e) => { e.stopPropagation(); })
            previewImg.addEventListener('click', (e) => { e.stopPropagation(); })
            nextArrow.addEventListener('click', next);
            prevArrow.addEventListener('click', prev);
            closeBtn.addEventListener('click', closeModal);
            prevArrow.addEventListener('click', (e) => { e.stopPropagation(); })
            nextArrow.addEventListener('click', (e) => { e.stopPropagation(); })
            rotateLeftBtn.addEventListener('click', rotateLeft);
            rotateRightBtn.addEventListener('click', rotateRight);
            zoomInBtn.addEventListener('click', zoomIn);
            zoomOutBtn.addEventListener('click', zoomOut);

            indexes.innerHTML = `1 / ${length}`;

            document.addEventListener('keydown', keyboardEvents);

            dragElement(previewImg);

        }

        const rotateLeft = () => {
            rotateLoop -= 90;
            previewImg.setAttribute('style', `transform: scale3d(${zoomLoop}, ${zoomLoop}, 1) rotate(${rotateLoop}deg)`);
        }

        const rotateRight = () => {
            rotateLoop += 90;
            previewImg.setAttribute('style', `transform: scale3d(${zoomLoop}, ${zoomLoop}, 1) rotate(${rotateLoop}deg)`);
        }

        const zoomIn = () => {
            zoomLoop += .5;
            zoomOutBtn.classList.remove('disabled');
            previewImg.setAttribute('style', `transform: scale3d(${zoomLoop}, ${zoomLoop}, 1) rotate(${rotateLoop}deg)`);
        }

        const zoomOut = () => {
            if (zoomOutBtn.classList.contains('disabled')) return;   
            zoomLoop -= .5;
            previewImg.setAttribute('style', `transform: scale3d(${zoomLoop}, ${zoomLoop}, 1) rotate(${rotateLoop}deg)`);
            if (zoomLoop == 1) zoomOutBtn.classList.add('disabled');
        }

        const wheelZoom = (e) => {
            e.wheelDelta > 0 ? zoomIn() : zoomOut();
        }

        const keyboardEvents = (event) => {
            if (modal.classList.contains('show')) {
                if (event.keyCode == 39) next();
                if (event.keyCode == 37) prev();
            }
        }

        function createElement(tagName, html = "", attributes = {}, parent = false) {
            var el = document.createElement(''+tagName+'');
            el.innerHTML = html;
            for (let x in attributes) {	el.setAttribute(''+x+'',''+attributes[x]+''); }
            if (parent) parent.appendChild(el);
            return el;
        }

        const setIndexes = () => {
            for (let i = 0; i < items.length; i++) {
                items[i].setAttribute('data-index',i)
            }
        }

        const create = () => {
            createSources();
            createModal();
            setIndexes();
        }

        const openModal = (e) => {
            const index = e.target.getAttribute('data-index');
            modal.classList.add('show');
            previewImg.setAttribute('src', sources[index]);
            indexes.innerHTML = `${Number(index) + 1} / ${length}`;
            nextIndex  = index;
            setNextIndex();
        }

        const closeModal = () => {
            modal.classList.remove('show');
            previewImg.setAttribute('src', sources[0]);
            rotateLoop = 0; 
            zoomLoop = 1;
            previewImg.setAttribute('style', `transform: scale3d(1, 1, 1) rotate(0deg)`);
            zoomOutBtn.classList.add('disabled');
        }

        const setNextIndex = () => { 
            nextIndex == 0 ? prevIndex = lastIndex : prevIndex = nextIndex - 1 ;
            nextIndex == lastIndex ? nextIndex = 0 : nextIndex++; 
        }
    
        const setPrevIndex = () => { 
            prevIndex == lastIndex ? nextIndex = 0 : nextIndex = prevIndex + 1; 
            prevIndex == 0 ? prevIndex = lastIndex : prevIndex--; 
        }
    
        const next = () => {
            previewImg.setAttribute('src', sources[nextIndex]);
            indexes.innerHTML = `${Number(nextIndex) + 1} / ${length}`;
            setNextIndex();
            defaultPosition();
        }

        const defaultPosition = () => {
            previewImg.style.top = "auto";
            previewImg.style.left = "auto";
        }
    
        const prev = () => {
            previewImg.setAttribute('src', sources[prevIndex]);
            indexes.innerHTML = `${Number(prevIndex) + 1} / ${length}`;
            setPrevIndex();
            defaultPosition();
        }

        const dragElement = (elmnt) => {

            elmnt.onmousedown = dragMouseDown;
            elmnt.ontouchstart = dragMouseDown;
          
            function dragMouseDown(e) {

                e = e || window.event;
                e.preventDefault();

                pos3 = e.clientX || e.touches[0].clientX;
                pos4 = e.clientY || e.touches[0].clientY;
                document.onmouseup = closeDragElement;
                document.ontouchend = closeDragElement;
                document.ontouchcancel = closeDragElement;

                document.onmousemove = elementDrag;
                document.ontouchmove = elementDrag;
                elmnt.classList.add('dragging');

            }

            function elementDrag(e) {

                e = e || window.event;
                if (e.clientX) e.preventDefault();

                pos1 = pos3 - (e.clientX || e.touches[0].clientX);
                pos2 = pos4 - (e.clientY || e.touches[0].clientY);
                pos3 = e.clientX || e.touches[0].clientX;
                pos4 = e.clientY || e.touches[0].clientY;

                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

            }
          
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                document.ontouchend = null;
                document.ontouchmove = null;
                elmnt.classList.remove('dragging');
            }

        }

        // adding-events
        items.forEach((item) => {
            item.addEventListener('click', openModal)
        })

        // calling-functions
        create();

    }

    lightboxes.forEach((con) => lightbox(con));
    
}


flLightbox();

