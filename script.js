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
        
        // --- Configuration for available show dates ---
        const showYear = 2025;
        const showMonth = 7; // August (0-indexed: January is 0)
        const availableShowDays = [23, 24, 26, 27, 29, 30, 31];
        // --- End Configuration ---

        let currentDate = new Date(showYear, showMonth, 1); // Start calendar in August 2024
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

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Render days of the current month
            for (let i = 1; i <= daysInMonth; i++) {
                const dayCell = document.createElement('div');
                dayCell.textContent = i;
                dayCell.classList.add('day');
                
                const cellDate = new Date(year, month, i);
                const isAvailable = year === showYear && month === showMonth && availableShowDays.includes(i);

                if (isAvailable) {
                    dayCell.addEventListener('click', () => selectDate(cellDate));
                } else {
                    dayCell.classList.add('disabled');
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
            
            const dayOfWeek = date.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
            const ticketLink = "https://gclt.sales.ticketsearch.com/sales/salesevent/138748";
            let showtimesHTML = '';

            // Weekends (Saturday & Sunday) have two shows
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                showtimesHTML += `
                    <div class="showtime-card">
                        <p>1:00 PM</p>
                        <a href="${ticketLink}" target="_blank" rel="noopener noreferrer" class="cta-button">Select Seats</a>
                    </div>`;
            }

            // All available days have a 7:00 PM show
            showtimesHTML += `
            <div class="showtime-card">
                <p>7:30 PM</p>
                <a href="${ticketLink}" target="_blank" rel="noopener noreferrer" class="cta-button">Select Seats</a>
            </div>`;

            showtimesList.innerHTML = showtimesHTML;
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