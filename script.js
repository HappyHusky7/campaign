document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu logic
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Calendar logic for tickets.html
    const calendarGrid = document.getElementById('days-grid');
    if (calendarGrid) {
        const monthYearEl = document.getElementById('month-year');
        const prevMonthBtn = document.getElementById('prev-month-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');
        const selectedDateDisplay = document.getElementById('selected-date-display');
        const showtimesList = document.getElementById('showtimes-list');

        let currentDate = new Date();
        let selectedDate = null;

        const renderCalendar = () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            monthYearEl.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
            calendarGrid.innerHTML = '';

            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const prevMonthLastDay = new Date(year, month, 0).getDate();

            // Render trailing days from the previous month
            for (let i = firstDayOfMonth; i > 0; i--) {
                const dayCell = document.createElement('div');
                dayCell.textContent = prevMonthLastDay - i + 1;
                dayCell.classList.add('day', 'disabled', 'prev-next-month');
                calendarGrid.appendChild(dayCell);
            }

            // Render days of the current month
            for (let i = 1; i <= daysInMonth; i++) {
                const dayCell = document.createElement('div');
                dayCell.textContent = i;
                dayCell.classList.add('day');
                
                const cellDate = new Date(year, month, i);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Disable past dates and Tuesdays
                if (cellDate < today || cellDate.getDay() === 2) {
                    dayCell.classList.add('disabled');
                } else {
                    dayCell.addEventListener('click', () => selectDate(cellDate));
                }

                if (cellDate.getTime() === today.getTime()) dayCell.classList.add('today');
                if (selectedDate && cellDate.getTime() === selectedDate.getTime()) dayCell.classList.add('selected');

                calendarGrid.appendChild(dayCell);
            }

            // Render leading days of the next month to fill the grid
            const totalCells = calendarGrid.children.length;
            const remainingCells = 42 - totalCells; // 6 rows * 7 days = 42

            for (let i = 1; i <= remainingCells; i++) {
                const dayCell = document.createElement('div');
                dayCell.textContent = i;
                dayCell.classList.add('day', 'disabled', 'prev-next-month');
                calendarGrid.appendChild(dayCell);
            }
        };
        
        const selectDate = (date) => {
            selectedDate = date;
            renderCalendar();
            renderShowtimes(date);
        };

        const renderShowtimes = (date) => {
            selectedDateDisplay.textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            
            showtimesList.innerHTML = `
                <div class="showtime-card">
                    <p>3:00 PM</p>
                    <a href="https://example.com/book-seats" target="_blank" rel="noopener noreferrer" class="cta-button">Select Seats</a>
                </div>
                <div class="showtime-card">
                    <p>7:00 PM</p>
                    <a href="https://example.com/book-seats" target="_blank" rel="noopener noreferrer" class="cta-button">Select Seats</a>
                </div>
            `;
        };

        prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
        nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

        renderCalendar();
    }

    // Cast & Creative Modal Logic
    const castMembers = document.querySelectorAll('.cast-member');
    const modalOverlay = document.getElementById('cast-modal-overlay');

    if (castMembers.length > 0 && modalOverlay) {
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const modalName = document.getElementById('modal-name');
        const modalRole = document.getElementById('modal-role');
        const modalBio = document.getElementById('modal-bio');
        const modalImg = document.getElementById('modal-img');
        const modalInstagram = document.getElementById('modal-instagram');
        const modalSocials = document.querySelector('.modal-socials');

        const openModal = (member) => {
            // Populate modal with data from the clicked member's data attributes
            modalName.textContent = member.dataset.name;
            modalRole.innerHTML = `<em>${member.dataset.role}</em>`;
            modalBio.textContent = member.dataset.bio;
            modalImg.src = member.dataset.imgSrc;
            modalImg.alt = `Headshot of ${member.dataset.name}`;

            // Handle Instagram link
            const instagramUrl = member.dataset.instagram;
            if (instagramUrl && instagramUrl !== '#') {
                modalInstagram.href = instagramUrl;
                modalSocials.style.display = 'block';
            } else {
                modalSocials.style.display = 'none';
            }

            // Show the modal with a fade-in effect
            modalOverlay.classList.add('active');
        };

        const closeModal = () => {
            modalOverlay.classList.remove('active');
        };

        castMembers.forEach(member => {
            member.addEventListener('click', () => openModal(member));
        });

        modalCloseBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => e.target === modalOverlay && closeModal());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
        });
    }
});