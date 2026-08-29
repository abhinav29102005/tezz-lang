

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
            const res = await fetch(import.meta.env.VITE_API_URL + '/api/contact', {
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
    
      
      // SPA Router Logic
      const handleRoute = () => {
        const hash = window.location.hash;
        const homeView = document.getElementById('home-view');
        const docsView = document.getElementById('docs-view');
        
        // List of doc hashes or if we explicitly click "Documentation" (which links to #introduction)
        const docHashes = ['#introduction', '#installation-and-cli', '#syntax', '#hinglish', '#services-and-routes', '#deployment', '#ecosystem', '#example', '#service-block', '#routing', '#path-parameters', '#request-object', '#sending-responses', '#nodejs', '#cloudflare-workers', '#why-target', '#tezz-database', '#tezz-jwt'];
        
        // Also if we just use #docs, redirect to #introduction
        if (hash === '#docs') {
           window.location.hash = '#introduction';
           return;
        }

        const isDocPage = docHashes.some(h => hash.startsWith(h));

        if (isDocPage) {
          if (homeView) homeView.style.display = 'none';
          if (docsView) docsView.style.display = 'flex';
          
          // Scroll to the element
          setTimeout(() => {
            const el = document.getElementById(hash.substring(1));
            if (el) {
              const yOffset = -100; // Account for sticky header
              const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({top: y, behavior: 'smooth'});
            }
          }, 50);
          
          // Update active link in sidebar
          document.querySelectorAll('.npm-nav-list a').forEach(a => {
            if (a.getAttribute('href') === hash) {
               a.classList.add('active');
            } else {
               a.classList.remove('active');
            }
          });
        } else {
          if (homeView) homeView.style.display = 'block';
          if (docsView) docsView.style.display = 'none';
          if (!hash || hash === '#' || hash === '#home') {
            window.scrollTo({top: 0, behavior: 'smooth'});
          }
        }
      };

      window.addEventListener('hashchange', handleRoute);
      // Run once on load
      handleRoute();
