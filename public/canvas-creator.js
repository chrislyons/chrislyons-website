// Canvas Creator - Instagram Stories-style visual editor
// This handles all client-side canvas manipulation

class CanvasCreator {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.elements = [];
    this.selectedElement = null;
    this.dragState = { active: false, startX: 0, startY: 0 };
    this.resizeState = { active: false, handle: null };
    this.nextElementId = 1;

    this.setupEventListeners();
    this.loadCanvasData();
  }

  setupEventListeners() {
    // Toolbar buttons
    document.getElementById('btn-add-text')?.addEventListener('click', () => this.addTextElement());
    document.getElementById('btn-add-gif')?.addEventListener('click', () => this.openGifSearch());
    document.getElementById('btn-add-sticker')?.addEventListener('click', () => this.openStickerPicker());
    document.getElementById('btn-add-image')?.addEventListener('click', () => this.openImageUpload());

    // Canvas dimension presets
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.target.dataset.preset;
        this.setCanvasDimensions(preset);
      });
    });

    // Canvas background controls
    document.getElementById('bg-color')?.addEventListener('input', (e) => {
      this.setBackground('solid', e.target.value);
    });

    // Save/publish buttons
    document.getElementById('btn-save-draft')?.addEventListener('click', () => this.save(false));
    document.getElementById('btn-publish')?.addEventListener('click', () => this.save(true));

    // Canvas mouse events (for dragging elements)
    this.canvas.addEventListener('mousedown', (e) => this.handleCanvasMouseDown(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseup', (e) => this.handleMouseUp(e));

    // Delete key
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedElement) {
        e.preventDefault();
        this.deleteElement(this.selectedElement.id);
      }
    });
  }

  setCanvasDimensions(preset) {
    const dimensions = {
      stories: { width: 1080, height: 1920 },
      square: { width: 1080, height: 1080 },
      desktop: { width: 1440, height: 810 }
    };

    const dim = dimensions[preset];
    if (!dim) return;

    this.canvas.style.width = `${dim.width}px`;
    this.canvas.style.height = `${dim.height}px`;
    this.canvas.dataset.width = dim.width;
    this.canvas.dataset.height = dim.height;

    // Highlight active preset button
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.classList.remove('bg-purple-600', 'text-white');
      btn.classList.add('bg-gray-200');
    });
    document.querySelector(`[data-preset="${preset}"]`)?.classList.add('bg-purple-600', 'text-white');
  }

  setBackground(type, value) {
    if (type === 'solid') {
      this.canvas.style.background = value;
      this.canvas.dataset.bgType = 'solid';
      this.canvas.dataset.bgValue = value;
    } else if (type === 'gradient') {
      this.canvas.style.background = value;
      this.canvas.dataset.bgType = 'gradient';
      this.canvas.dataset.bgValue = value;
    } else if (type === 'image') {
      this.canvas.style.backgroundImage = `url(${value})`;
      this.canvas.style.backgroundSize = 'cover';
      this.canvas.dataset.bgType = 'image';
      this.canvas.dataset.bgValue = value;
    }
  }

  addTextElement(text = 'Double-click to edit', options = {}) {
    const id = `el-${this.nextElementId++}`;
    const element = {
      id,
      type: 'text',
      content: {
        text,
        font: options.font || 'Inter',
        fontSize: options.fontSize || 32,
        color: options.color || '#000000'
      },
      position: { x: options.x || 100, y: options.y || 100 },
      size: { width: options.width || 300, height: 'auto' },
      rotation: 0,
      zIndex: this.elements.length
    };

    this.elements.push(element);
    this.renderElement(element);
    this.selectElement(id);
  }

  addGifElement(url, title) {
    const id = `el-${this.nextElementId++}`;
    const element = {
      id,
      type: 'gif',
      content: { url, title },
      position: { x: 100, y: 100 },
      size: { width: 300, height: 300 },
      rotation: 0,
      zIndex: this.elements.length
    };

    this.elements.push(element);
    this.renderElement(element);
    this.selectElement(id);
  }

  addStickerElement(emoji) {
    const id = `el-${this.nextElementId++}`;
    const element = {
      id,
      type: 'sticker',
      content: { emoji },
      position: { x: 100, y: 100 },
      size: { width: 80, height: 80 },
      rotation: 0,
      zIndex: this.elements.length
    };

    this.elements.push(element);
    this.renderElement(element);
    this.selectElement(id);
  }

  renderElement(element) {
    const existing = document.getElementById(element.id);
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.id = element.id;
    div.className = 'canvas-element';
    div.style.position = 'absolute';
    div.style.left = `${element.position.x}px`;
    div.style.top = `${element.position.y}px`;
    div.style.width = element.size.width === 'auto' ? 'auto' : `${element.size.width}px`;
    div.style.height = element.size.height === 'auto' ? 'auto' : `${element.size.height}px`;
    div.style.transform = `rotate(${element.rotation}deg)`;
    div.style.zIndex = element.zIndex;
    div.dataset.elementId = element.id;

    // Render content based on type
    if (element.type === 'text') {
      div.innerHTML = `<div style="font-family: '${element.content.font}', sans-serif; font-size: ${element.content.fontSize}px; color: ${element.content.color}; padding: 8px;">${element.content.text}</div>`;
    } else if (element.type === 'gif') {
      div.innerHTML = `<img src="${element.content.url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
    } else if (element.type === 'sticker') {
      div.innerHTML = `<div style="font-size: ${element.size.width}px; line-height: 1; user-select: none;">${element.content.emoji}</div>`;
    }

    // Double-click to edit text
    if (element.type === 'text') {
      div.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        this.editTextElement(element.id);
      });
    }

    this.canvas.appendChild(div);
  }

  selectElement(id) {
    // Remove previous selection
    document.querySelectorAll('.canvas-element').forEach(el => {
      el.classList.remove('selected');
    });

    const element = this.elements.find(e => e.id === id);
    if (!element) return;

    this.selectedElement = element;
    const div = document.getElementById(id);
    div?.classList.add('selected');

    // Show element toolbar
    this.showElementToolbar(element);
  }

  showElementToolbar(element) {
    const toolbar = document.getElementById('element-toolbar');
    if (!toolbar) return;

    toolbar.classList.remove('hidden');

    // Update toolbar based on element type
    if (element.type === 'text') {
      document.getElementById('text-font')?.setAttribute('value', element.content.font);
      document.getElementById('text-size')?.setAttribute('value', element.content.fontSize);
      document.getElementById('text-color')?.setAttribute('value', element.content.color);
    }
  }

  handleCanvasMouseDown(e) {
    const target = e.target.closest('.canvas-element');

    if (target) {
      const id = target.dataset.elementId;
      this.selectElement(id);

      // Start dragging
      this.dragState = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        elementStartX: this.selectedElement.position.x,
        elementStartY: this.selectedElement.position.y
      };
    } else {
      // Clicked on canvas background - deselect
      this.selectedElement = null;
      document.querySelectorAll('.canvas-element').forEach(el => {
        el.classList.remove('selected');
      });
      document.getElementById('element-toolbar')?.classList.add('hidden');
    }
  }

  handleMouseMove(e) {
    if (!this.dragState.active || !this.selectedElement) return;

    const dx = e.clientX - this.dragState.startX;
    const dy = e.clientY - this.dragState.startY;

    this.selectedElement.position.x = this.dragState.elementStartX + dx;
    this.selectedElement.position.y = this.dragState.elementStartY + dy;

    this.renderElement(this.selectedElement);
  }

  handleMouseUp(e) {
    this.dragState.active = false;
  }

  editTextElement(id) {
    const element = this.elements.find(e => e.id === id);
    if (!element || element.type !== 'text') return;

    const newText = prompt('Edit text:', element.content.text);
    if (newText !== null) {
      element.content.text = newText;
      this.renderElement(element);
    }
  }

  deleteElement(id) {
    this.elements = this.elements.filter(e => e.id !== id);
    document.getElementById(id)?.remove();
    this.selectedElement = null;
    document.getElementById('element-toolbar')?.classList.add('hidden');
  }

  openGifSearch() {
    // Show GIF search modal
    const modal = document.getElementById('gif-modal');
    if (modal) {
      modal.showModal();
      this.setupGifSearch();
    }
  }

  setupGifSearch() {
    const searchInput = document.getElementById('gif-search-input');
    const resultsDiv = document.getElementById('gif-results');
    let debounceTimer;

    if (!searchInput || !resultsDiv) return;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const query = e.target.value;
        if (!query) return;

        try {
          const res = await fetch(`/admin/giphy?q=${encodeURIComponent(query)}`);
          const data = await res.json();

          if (data.data && data.data.length > 0) {
            resultsDiv.innerHTML = data.data.map(gif => `
              <img src="${gif.images.fixed_width.url}"
                   class="cursor-pointer hover:opacity-80 rounded"
                   data-url="${gif.images.original.url}"
                   data-title="${gif.title}">
            `).join('');

            // Add click handlers
            resultsDiv.querySelectorAll('img').forEach(img => {
              img.addEventListener('click', () => {
                this.addGifElement(img.dataset.url, img.dataset.title);
                document.getElementById('gif-modal')?.close();
              });
            });
          }
        } catch (error) {
          console.error('GIF search failed:', error);
        }
      }, 300);
    });
  }

  openStickerPicker() {
    const emojis = ['😀', '😍', '🔥', '✨', '🎉', '👍', '❤️', '🌟', '💯', '🚀'];
    const emoji = prompt(`Pick a sticker:\n${emojis.join(' ')}\n\nPaste emoji:`);
    if (emoji) {
      this.addStickerElement(emoji);
    }
  }

  openImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Upload to R2
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/admin/upload', { method: 'POST', body: formData });
        const { url } = await res.json();

        // Add as GIF element (works for images too)
        this.addGifElement(url, file.name);
      } catch (error) {
        alert('Upload failed: ' + error.message);
      }
    };
    input.click();
  }

  async save(published) {
    const canvasData = {
      title: document.getElementById('canvas-title')?.value || 'Untitled',
      background: {
        type: this.canvas.dataset.bgType || 'solid',
        value: this.canvas.dataset.bgValue || '#ffffff'
      },
      dimensions: {
        width: parseInt(this.canvas.dataset.width) || 1080,
        height: parseInt(this.canvas.dataset.height) || 1920
      },
      elements: this.elements,
      published: published ? 1 : 0
    };

    try {
      const res = await fetch('/admin/canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(canvasData)
      });

      if (res.ok) {
        alert(published ? 'Published!' : 'Saved as draft!');
        window.location.href = '/admin';
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      alert('Failed to save: ' + error.message);
    }
  }

  loadCanvasData() {
    // Load from URL parameter if editing existing canvas
    const urlParams = new URLSearchParams(window.location.search);
    const canvasId = urlParams.get('id');

    if (canvasId) {
      // Fetch canvas data from server
      fetch(`/admin/canvas/${canvasId}`)
        .then(res => res.json())
        .then(data => {
          this.canvas.dataset.width = data.dimensions.width;
          this.canvas.dataset.height = data.dimensions.height;
          this.setCanvasDimensions('custom');
          this.setBackground(data.background.type, data.background.value);

          data.elements.forEach(element => {
            this.elements.push(element);
            this.renderElement(element);
          });
        });
    } else {
      // New canvas - set default to Stories
      this.setCanvasDimensions('stories');
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.canvasCreator = new CanvasCreator();
  });
} else {
  window.canvasCreator = new CanvasCreator();
}
