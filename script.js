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
                    <a href="#" class="cta-button">Select Tickets</a>
                </div>
                <div class="showtime-card">
                    <p>7:00 PM</p>
                    <a href="#" class="cta-button">Select Tickets</a>
                </div>
            `;
        };

        prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
        nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

        renderCalendar();
    }
});