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

    // --- Style Injection for Dynamic Components ---
    // For best practice, move these styles to your main CSS file.
    const styles = `
        #seat-selection-container {
            margin-top: 2rem;
            /* Fluid padding: min 0.5rem, ideal 3vw, max 1.5rem */
            padding: clamp(0.5rem, 3vw, 1.5rem);
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .seat-map-header {
            text-align: center;
            margin-bottom: 1.5rem;
            /* Fluid font size: min 1rem, ideal 4vw, max 1.5rem */
            font-size: clamp(1rem, 4vw, 1.5rem);
            color: #333;
        }
        .theatre-layout {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 1.5rem;
            max-width: 100%;
            overflow-x: auto; /* Allows horizontal scroll on small screens */
            padding: 10px 0;
        }
        .screen {
            width: 90%;
            max-width: 600px;
            min-width: 250px;
            background-color: #333;
            color: white;
            text-align: center;
            padding: 0.5rem;
            margin-bottom: 2rem;
            border-radius: 4px;
            letter-spacing: 0.2em;
            font-weight: bold;
            font-size: clamp(0.8em, 2.5vw, 1em);
        }
        #seat-map { display: flex; flex-direction: column; gap: 5px; }
        .seat-row { display: flex; justify-content: center; gap: clamp(2px, 0.5vw, 5px); }
        .seat-row.aisle-divider { margin-top: 20px; }
        .row-label {
            /* Fluid width and font size: min 8px, ideal 2.5vw, max 25px */
            width: clamp(8px, 2.5vw, 25px);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #555;
            font-weight: bold;
            font-size: clamp(0.5em, 2vw, 1em);
            flex-shrink: 0; /* Prevent shrinking on smaller screens */
        }
        .seat {
            /* Fluid seat size: min 8px, ideal 2.5vw, max 25px */
            width: clamp(8px, 2.5vw, 25px);
            height: clamp(8px, 2.5vw, 25px);
            background-color: #a8d8b2; /* Available */
            border: 1px solid #77a87f;
            border-radius: clamp(2px, 0.7vw, 5px);
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.1s ease;
            flex-shrink: 0; /* Prevent seats from shrinking on small screens */
        }
        .seat:hover:not(.selected):not(.unavailable) { background-color: #8bc396; }
        .seat.selected { background-color: #8e44ad; border-color: #732d91; transform: scale(1.1); }
        .seat.unavailable { background-color: #e0e0e0; border-color: #bdbdbd; cursor: not-allowed; }
        .seat.premium { background-color: #4a90e2; border-color: #357abd; cursor: pointer; }
        #seat-selection-summary { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #ddd; text-align: center; }

        /* --- Fluid Calendar Styles for Mobile --- */
        #month-year {
            font-size: clamp(1.2rem, 5vw, 1.8rem);
        }
        #days-grid .day {
            font-size: clamp(0.6rem, 2.5vw, 1rem);
            min-height: clamp(20px, 8vw, 40px); /* Control height for consistent rows */
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    // --- End Style Injection ---

    // Calendar logic for tickets.html
    const calendarGrid = document.getElementById('days-grid');
    if (calendarGrid) {
        const calendarContainer = calendarGrid.parentElement;
        const monthYearEl = document.getElementById('month-year');
        const prevMonthBtn = document.getElementById('prev-month-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');
        const selectedDateDisplay = document.getElementById('selected-date-display');
        const showtimesList = document.getElementById('showtimes-list');
        const showtimesContainer = showtimesList.parentElement;

        // Create and inject the container for the seat map
        const seatSelectionContainer = document.createElement('div');
        seatSelectionContainer.id = 'seat-selection-container';
        seatSelectionContainer.style.display = 'none'; // Initially hidden
        showtimesList.parentElement.insertAdjacentElement('afterend', seatSelectionContainer);

        let selectedSeats = []; 
        const seatPrice = 15.00; // Example price per seat
        
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
            // Unlock the calendar's width, allowing it to be responsive again
            if (calendarContainer) {
                calendarContainer.style.width = '';
            }
            // Unlock the showtimes container's width as well
            if (showtimesContainer) {
                showtimesContainer.style.width = '';
            }
            selectedDate = date;
            renderCalendar();
            seatSelectionContainer.style.display = 'none'; // Hide seats when new date is picked
            renderShowtimes(date);
        };

        const renderShowtimes = (date) => {
            selectedDateDisplay.textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            
            const dayOfWeek = date.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
            let showtimesHTML = '';

            // Weekends (Saturday & Sunday) have two shows
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                showtimesHTML += `
                    <div class="showtime-card">
                        <p>1:00 PM</p>
                        <button class="cta-button select-seats-btn" data-time="1:00 PM">Select Seats</button>
                    </div>`;
            }

            // All available days have a 7:00 PM show
            showtimesHTML += `
            <div class="showtime-card">
                <p>7:30 PM</p>
                <button class="cta-button select-seats-btn" data-time="7:30 PM">Select Seats</button>
            </div>`;

            showtimesList.innerHTML = showtimesHTML;
        };

        const updateSelectionSummary = () => {
            const selectedSeatsList = document.getElementById('selected-seats-list');
            const totalPriceDisplay = document.getElementById('total-price');
            if (!selectedSeatsList || !totalPriceDisplay) return;

            if (selectedSeats.length === 0) {
                selectedSeatsList.textContent = 'None';
                totalPriceDisplay.textContent = 'AUD $0.00';
            } else {
                // Sort seats for consistent display, e.g., A1, A2, B10
                selectedSeats.sort((a, b) => {
                    const rowA = a.charAt(0);
                    const rowB = b.charAt(0);
                    const numA = parseInt(a.substring(1), 10);
                    const numB = parseInt(b.substring(1), 10);
                    if (rowA < rowB) return -1;
                    if (rowA > rowB) return 1;
                    return numA - numB;
                });
                selectedSeatsList.textContent = selectedSeats.join(', ');
                const total = selectedSeats.length * seatPrice;
                totalPriceDisplay.textContent = `AUD $${total.toFixed(2)}`;
            }
        };

        const renderSeatMap = (date, time) => {
            // Before showing the map, get the calendar's current width and set it as a fixed style.
            // This "locks" the width, preventing it from changing when the seat map appears.
            if (calendarContainer) {
                const calendarWidth = getComputedStyle(calendarContainer).width;
                calendarContainer.style.width = calendarWidth;
            }
            // Apply the same width-locking technique to the showtimes container.
            if (showtimesContainer) {
                const showtimesWidth = getComputedStyle(showtimesContainer).width;
                showtimesContainer.style.width = showtimesWidth;
            }
            selectedSeats = []; // Reset selection
            seatSelectionContainer.innerHTML = ''; // Clear previous map
            seatSelectionContainer.style.display = 'block';

            const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            const header = document.createElement('h3');
            header.className = 'seat-map-header';
            header.textContent = `Select Seats for ${time} on ${formattedDate}`;
            seatSelectionContainer.appendChild(header);

            const theatreLayout = document.createElement('div');
            theatreLayout.className = 'theatre-layout';

            const screenDiv = document.createElement('div');
            screenDiv.className = 'screen';
            screenDiv.textContent = 'STAGE';
            theatreLayout.appendChild(screenDiv);

            const seatMap = document.createElement('div');
            seatMap.id = 'seat-map';

            const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            rows.forEach(row => {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'seat-row';

                // Add a visual break for the aisle between rows D and E
                if (row === 'E') {
                    rowDiv.classList.add('aisle-divider');
                }

                // Add left row label
                const leftLabel = document.createElement('div');
                leftLabel.className = 'row-label';
                leftLabel.textContent = row;
                rowDiv.appendChild(leftLabel);

                let seatCount;
                if (row === 'A' || row === 'B') {
                    seatCount = 18; // First two rows have 18 seats
                } else if (row === 'C' || row === 'D') {
                    seatCount = 20; // Next two rows have 20 seats
                } else {
                    seatCount = 22; // All other rows have 22 seats
                }

                for (let i = 1; i <= seatCount; i++) {
                    const seatDiv = document.createElement('div');
                    seatDiv.className = 'seat';
                    const seatId = `${row}${i}`;
                    seatDiv.dataset.seatId = seatId;

                    // Mark first three seats of Row E as premium
                    if (row === 'E' && i <= 3) {
                        seatDiv.classList.add('premium');
                    }
                    
                    seatDiv.addEventListener('click', () => {
                        if (seatDiv.classList.contains('unavailable')) return;

                        const seatId = seatDiv.dataset.seatId;
                        seatDiv.classList.toggle('selected');

                        if (seatDiv.classList.contains('selected')) {
                            selectedSeats.push(seatId);
                        } else {
                            selectedSeats = selectedSeats.filter(s => s !== seatId);
                        }
                        updateSelectionSummary();
                    });
                    rowDiv.appendChild(seatDiv);
                }

                // Add right row label
                const rightLabel = document.createElement('div');
                rightLabel.className = 'row-label';
                rightLabel.textContent = row;
                rowDiv.appendChild(rightLabel);

                seatMap.appendChild(rowDiv);
            });
            theatreLayout.appendChild(seatMap);

            seatSelectionContainer.appendChild(theatreLayout);

            const summaryDiv = document.createElement('div');
            summaryDiv.id = 'seat-selection-summary';
            summaryDiv.innerHTML = `<p>Selected: <span id="selected-seats-list">None</span></p><p>Total: <span id="total-price">AUD $0.00</span></p><button id="confirm-seats-btn" class="cta-button">Confirm & Checkout</button>`;
            seatSelectionContainer.appendChild(summaryDiv);
            
            updateSelectionSummary();
            seatSelectionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
        nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

        renderCalendar();

        // Add event listener for seat selection buttons using event delegation
        showtimesList.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('select-seats-btn')) {
                const time = e.target.dataset.time;
                renderSeatMap(selectedDate, time);
            }
        });
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