document.addEventListener('DOMContentLoaded', () => {
            loadItems();
            updateTotal();
            document.getElementById('mode-toggle').addEventListener('change', toggleMode);
        });

        document.getElementById('item-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const itemName = document.getElementById('item-name').value;
            const itemPrice = document.getElementById('item-price').value;
            const priceValue = itemPrice ? parseFloat(itemPrice).toFixed(2) : null;
            addItem(itemName, priceValue, false);
            saveItems();
            updateTotal();
            document.getElementById('item-name').value = '';
            document.getElementById('item-price').value = '';
        });

        document.getElementById('shopping-items-list').addEventListener('change', function(e) {
            if (e.target.classList.contains('checkbox')) {
                const row = e.target.closest('tr');
                if (e.target.checked) {
                    row.classList.add('checked');
                } else {
                    row.classList.remove('checked');
                }
                saveItems();
                updateTotal();
            }
        });

        document.getElementById('shopping-items-list').addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-button')) {
                const row = e.target.closest('tr');
                row.remove();
                saveItems();
                updateTotal();
            }
        });

        document.getElementById('list-items-list').addEventListener('change', function(e) {
            if (e.target.classList.contains('checkbox')) {
                const row = e.target.closest('tr');
                if (e.target.checked) {
                    row.classList.add('checked');
                } else {
                    row.classList.remove('checked');
                }
                saveItems();
            }
        });

        document.getElementById('list-items-list').addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-button')) {
                const row = e.target.closest('tr');
                row.remove();
                saveItems();
            }
        });

        document.getElementById('reset-button').addEventListener('click', function() {
            document.getElementById('shopping-items-list').innerHTML = '';
            document.getElementById('list-items-list').innerHTML = '';
            saveItems();
            updateTotal();
        });

        function addItem(name, price, checked) {
            const shoppingRow = document.createElement('tr');
            shoppingRow.innerHTML = `
                <td>${name}</td>
                <td class="price-column">${price !== null ? price : ''}</td>
                <td><input type="checkbox" class="checkbox" ${checked ? 'checked' : ''}><i class="fas fa-trash delete-button"></i></td>
            `;
            if (checked) {
                shoppingRow.classList.add('checked');
            }
            shoppingRow.style.animation = 'add-item 0.5s ease';
            document.getElementById('shopping-items-list').appendChild(shoppingRow);

            const listRow = document.createElement('tr');
            listRow.innerHTML = `
                <td>${name}</td>
                <td><input type="checkbox" class="checkbox" ${checked ? 'checked' : ''}><i class="fas fa-trash delete-button"></i></td>
            `;
            if (checked) {
                listRow.classList.add('checked');
            }
            listRow.style.animation = 'add-item 0.5s ease';
            document.getElementById('list-items-list').appendChild(listRow);
        }

        function animateValue(id, start, end, duration) {
            const obj = document.getElementById(id);
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                obj.innerText = (start + progress * (end - start)).toFixed(2);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        function updateTotal() {
            const rows = document.querySelectorAll('#shopping-items-list tr');
            let total = 0;
            rows.forEach(row => {
                const priceText = row.querySelector('.price-column').innerText;
                const price = priceText ? parseFloat(priceText) : 0;
                const isChecked = row.querySelector('.checkbox').checked;
                if (!isChecked) {
                    total += price;
                }
            });
            const currentTotal = parseFloat(document.getElementById('total-price').innerText);
            animateValue('total-price', currentTotal, total, 1000); // Duration is 1000ms or 1 second
        }

        function saveItems() {
            const shoppingRows = document.querySelectorAll('#shopping-items-list tr');
            const items = [];

            shoppingRows.forEach(row => {
                const name = row.cells[0].innerText;
                const priceText = row.querySelector('.price-column').innerText;
                const price = priceText ? parseFloat(priceText) : null;
                const isChecked = row.querySelector('.checkbox').checked;
                items.push({ name, price, checked: isChecked });
            });

            localStorage.setItem('items', JSON.stringify(items));
        }

        function loadItems() {
            const items = JSON.parse(localStorage.getItem('items')) || [];
            document.getElementById('shopping-items-list').innerHTML = '';
            document.getElementById('list-items-list').innerHTML = '';
            items.forEach(item => addItem(item.name, item.price, item.checked));
        }

        function toggleMode() {
            const isListMode = document.getElementById('mode-toggle').checked;
            const itemPriceInput = document.getElementById('item-price');
            const shoppingTable = document.getElementById('shopping-table');
            const listTable = document.getElementById('list-table');

            if (isListMode) {
                itemPriceInput.disabled = true;
                shoppingTable.style.display = 'none';
                listTable.style.display = '';
                document.getElementById('mode-label').innerText = 'Mode Liste';
            } else {
                itemPriceInput.disabled = false;
                shoppingTable.style.display = '';
                listTable.style.display = 'none';
                document.getElementById('mode-label').innerText = 'Mode Courses';
            }
        }
