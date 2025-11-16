(function () {
      const form = document.getElementById('memeForm');
      const grid = document.getElementById('memeGrid');
      const status = document.getElementById('status');

      const topInput = document.getElementById('topText');
      const bottomInput = document.getElementById('bottomText');
      const urlInput = document.getElementById('imageUrl');

      // Helper: display transient status messages
      let statusTimer = null;
      function setStatus(message, isError = false) {
        clearTimeout(statusTimer);
        status.textContent = message || '';
        status.style.color = isError ? '#ffadad' : '#ffd29d';
        if (message) {
          statusTimer = setTimeout(() => (status.textContent = ''), 3000);
        }
      }

      // Validate using both HTML5 validity & simple non-empty checks
      function isFormValid() {
        const fields = [topInput, bottomInput, urlInput];
        return fields.every((el) => el.value.trim().length > 0 && el.checkValidity());
      }

      // Create a single meme card element
      function createMeme({ top, bottom, url }) {
        const wrapper = document.createElement('article');
        wrapper.className = 'meme';
        wrapper.setAttribute('role', 'group');
        wrapper.setAttribute('aria-label', 'Generated meme');

        // Delete button
        const del = document.createElement('button');
        del.className = 'delete';
        del.type = 'button';
        del.title = 'Delete this meme';
        del.setAttribute('aria-label', 'Delete meme');
        del.textContent = '×';

        // Image (we wait for it to load successfully)
        const img = document.createElement('img');
        img.alt = 'Meme background';
        img.decoding = 'async';
        img.loading = 'lazy';

        // Text overlays
        const topLine = document.createElement('div');
        topLine.className = 'line top';
        topLine.textContent = top;

        const bottomLine = document.createElement('div');
        bottomLine.className = 'line bottom';
        bottomLine.textContent = bottom;

        // Wire up delete
        del.addEventListener('click', () => {
          wrapper.remove();
          setStatus('Meme removed.');
        });

        // If the image fails, show a friendly message and abort adding this card
        img.addEventListener('error', () => {
          wrapper.remove();
          setStatus('Could not load that image URL. Please check the link and try again.', true);
        });

        // When the image loads, insert text overlays
        img.addEventListener('load', () => {
          wrapper.appendChild(topLine);
          wrapper.appendChild(bottomLine);
        });

        // Compose + return
        wrapper.appendChild(del);
        wrapper.appendChild(img);
        img.src = url; // set src last to ensure listeners are attached

        return wrapper;
      }

      // Event delegation (future-proof if you add more controls)
      grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete');
        if (btn) {
          btn.click();
        }
      });

      // Handle form submit
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation guard
        if (!isFormValid()) {
          // Trigger built-in UI hints where possible
          form.reportValidity?.();
          setStatus('Please fill out all fields with valid values before generating.', true);
          return;
        }

        const top = topInput.value.trim();
        const bottom = bottomInput.value.trim();
        const url = urlInput.value.trim();

        const card = createMeme({ top, bottom, url });
        grid.prepend(card); // newest first

        // Clear inputs & focus the first field
        form.reset();
        topInput.focus();
        setStatus('Meme added!');
      });

      // Optional: Enter key anywhere in form submits (handled by button default)
      // Optional: Escape clears form if focused within
      form.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          form.reset();
          setStatus('Form cleared.');
          topInput.focus();
        }
      });
    })();