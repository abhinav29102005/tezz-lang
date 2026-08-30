

      const themeToggle = document.getElementById('themeToggle');
      const root = document.documentElement;
      
      const updateIcon = () => {
        if (themeToggle) {
          themeToggle.innerHTML = root.classList.contains('dark-theme') ? '☀️' : '🌙';
        }
      };
      
      updateIcon();
      
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          root.classList.toggle('dark-theme');
          const isDark = root.classList.contains('dark-theme');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
          updateIcon();
        });
      }


      // Handle copy for pre blocks and hero-code-box
      document.querySelectorAll('pre, .hero-code-box').forEach(block => {
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.innerHTML = 'Copy';
        block.appendChild(btn);
        
        btn.addEventListener('click', async () => {
          const code = block.querySelector('code');
          const text = code ? code.innerText : block.innerText.replace('Copy', '');
          await navigator.clipboard.writeText(text.trim());
          btn.innerHTML = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        });
      });

      // Handle contact form submission
      const contactForm = document.getElementById('contactForm');
      if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const btn = e.target.querySelector('button');
          const feedback = document.getElementById('contactFeedback');
          const originalText = btn.innerHTML;
          
          btn.innerHTML = 'Sending...';
          btn.disabled = true;
          
          try {
            const res = await fetch((import.meta.env.VITE_API_URL || 'https://tezz-contact-api.bigboyaks-account.workers.dev') + '/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                message: document.getElementById('contactMessage').value
              })
            });
            
            if (res.ok) {
              feedback.style.display = 'block';
              feedback.style.color = 'var(--success-color, #28a745)';
              feedback.innerHTML = 'Message sent successfully!';
              e.target.reset();
            } else {
              throw new Error('Failed to send');
            }
          } catch (err) {
            feedback.style.display = 'block';
            feedback.style.color = 'var(--npm-red, #cb3837)';
            feedback.innerHTML = 'Error sending message. Try again later.';
          } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }
        });
      }
    
      
      