// Admin Canvas - Client-side JavaScript

const addBlockModal = document.getElementById('add-block-modal');
const editBlockModal = document.getElementById('edit-block-modal');
const addBlockBtn = document.getElementById('add-block-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

let currentEditingId = null;
let currentBlockType = null;

// Font list
const FONTS = [
  { name: 'Inter', category: 'sans-serif' },
  { name: 'Work Sans', category: 'sans-serif' },
  { name: 'DM Sans', category: 'sans-serif' },
  { name: 'Playfair Display', category: 'serif' },
  { name: 'Lora', category: 'serif' },
  { name: 'Merriweather', category: 'serif' },
  { name: 'Bebas Neue', category: 'display' },
  { name: 'Righteous', category: 'display' },
  { name: 'Caveat', category: 'handwriting' },
  { name: 'Pacifico', category: 'handwriting' },
  { name: 'Permanent Marker', category: 'handwriting' },
  { name: 'Space Mono', category: 'monospace' },
  { name: 'JetBrains Mono', category: 'monospace' },
];

// Open add block modal
addBlockBtn.addEventListener('click', () => {
  addBlockModal.showModal();
});

// Close modal
closeModalBtn.addEventListener('click', () => {
  addBlockModal.close();
});

// Block type selection
document.querySelectorAll('.block-types button').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    addBlockModal.close();
    openEditor(type);
  });
});

// Open editor for specific block type
function openEditor(type, entryId = null) {
  currentBlockType = type;
  currentEditingId = entryId;

  const modalContent = document.getElementById('edit-modal-content');

  switch (type) {
    case 'text':
      modalContent.innerHTML = getTextEditor();
      break;
    case 'image':
      modalContent.innerHTML = getImageEditor();
      setupImageUpload();
      break;
    case 'gif':
      modalContent.innerHTML = getGifEditor();
      setupGifSearch();
      break;
    case 'quote':
      modalContent.innerHTML = getQuoteEditor();
      break;
  }

  editBlockModal.showModal();
}

// Text editor HTML
function getTextEditor() {
  return `
    <h2 class="text-2xl font-bold mb-6">Text Block</h2>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold mb-2">Text Content</label>
        <textarea id="text-content" class="w-full p-3 border border-gray-300 rounded-lg min-h-32 font-sans" placeholder="Write your thoughts..."></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold mb-2">Font</label>
          <select id="font-picker" class="w-full p-3 border border-gray-300 rounded-lg">
            ${FONTS.map(f => `<option value="${f.name}">${f.name}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">Size</label>
          <div class="flex items-center gap-3">
            <input type="range" id="font-size" min="14" max="48" value="18" class="flex-1">
            <span id="size-display" class="text-sm font-mono">18px</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <input type="checkbox" id="published" class="w-5 h-5">
        <label for="published" class="text-sm font-semibold">Publish immediately</label>
      </div>

      <div class="flex gap-3 mt-6">
        <button id="save-btn" class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
          Save
        </button>
        <button id="cancel-btn" class="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </div>
  `;
}

// Image editor HTML
function getImageEditor() {
  return `
    <h2 class="text-2xl font-bold mb-6">Image Block</h2>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold mb-2">Upload Image</label>
        <div id="upload-area" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition cursor-pointer">
          <input type="file" id="image-upload" accept="image/*" class="hidden">
          <div id="upload-prompt">
            <div class="text-4xl mb-2">📸</div>
            <p class="text-gray-600">Click to upload or drag and drop</p>
            <p class="text-sm text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
          <div id="image-preview" class="hidden">
            <img id="preview-img" class="max-w-full max-h-64 mx-auto rounded-lg">
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-2">Caption (optional)</label>
        <input type="text" id="image-caption" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Add a caption...">
      </div>

      <div class="flex items-center gap-3">
        <input type="checkbox" id="published" class="w-5 h-5">
        <label for="published" class="text-sm font-semibold">Publish immediately</label>
      </div>

      <div class="flex gap-3 mt-6">
        <button id="save-btn" class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
          Save
        </button>
        <button id="cancel-btn" class="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </div>
  `;
}

// GIF editor HTML
function getGifEditor() {
  return `
    <h2 class="text-2xl font-bold mb-6">GIF Block</h2>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold mb-2">Search Giphy</label>
        <input type="text" id="gif-search" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Search for GIFs...">
      </div>

      <div id="gif-results" class="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
        <div class="col-span-3 text-center text-gray-400 py-8">
          Search for GIFs to get started
        </div>
      </div>

      <input type="hidden" id="selected-gif-url">
      <input type="hidden" id="selected-gif-title">

      <div class="flex items-center gap-3">
        <input type="checkbox" id="published" class="w-5 h-5">
        <label for="published" class="text-sm font-semibold">Publish immediately</label>
      </div>

      <div class="flex gap-3 mt-6">
        <button id="save-btn" class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
          Save
        </button>
        <button id="cancel-btn" class="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </div>
  `;
}

// Quote editor HTML
function getQuoteEditor() {
  return `
    <h2 class="text-2xl font-bold mb-6">Quote Block</h2>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold mb-2">Quote Text</label>
        <textarea id="quote-text" class="w-full p-3 border border-gray-300 rounded-lg min-h-24" placeholder="Enter the quote..."></textarea>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-2">Author (optional)</label>
        <input type="text" id="quote-author" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Author name...">
      </div>

      <div>
        <label class="block text-sm font-semibold mb-2">Font</label>
        <select id="font-picker" class="w-full p-3 border border-gray-300 rounded-lg">
          ${FONTS.map(f => `<option value="${f.name}">${f.name}</option>`).join('')}
        </select>
      </div>

      <div class="flex items-center gap-3">
        <input type="checkbox" id="published" class="w-5 h-5">
        <label for="published" class="text-sm font-semibold">Publish immediately</label>
      </div>

      <div class="flex gap-3 mt-6">
        <button id="save-btn" class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
          Save
        </button>
        <button id="cancel-btn" class="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </div>
  `;
}

// Setup image upload
function setupImageUpload() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('image-upload');
  const preview = document.getElementById('image-preview');
  const previewImg = document.getElementById('preview-img');
  const prompt = document.getElementById('upload-prompt');

  uploadArea.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        prompt.classList.add('hidden');
        preview.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  // Save button handler
  setTimeout(() => {
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    saveBtn.addEventListener('click', async () => {
      const file = fileInput.files[0];
      if (!file) {
        alert('Please select an image');
        return;
      }

      const caption = document.getElementById('image-caption').value;
      const published = document.getElementById('published').checked;

      saveBtn.textContent = 'Uploading...';
      saveBtn.disabled = true;

      try {
        // Upload to R2
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const { url } = await uploadRes.json();

        // Create entry
        await fetch('/admin/entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'image',
            content: { url, caption, alt: caption || 'Image' },
            published,
          }),
        });

        editBlockModal.close();
        window.location.reload();
      } catch (error) {
        alert('Failed to upload image: ' + error.message);
        saveBtn.textContent = 'Save';
        saveBtn.disabled = false;
      }
    });

    cancelBtn.addEventListener('click', () => editBlockModal.close());
  }, 0);
}

// Setup GIF search
function setupGifSearch() {
  const searchInput = document.getElementById('gif-search');
  const resultsDiv = document.getElementById('gif-results');
  let debounceTimer;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const query = e.target.value;
      if (!query) {
        resultsDiv.innerHTML = '<div class="col-span-3 text-center text-gray-400 py-8">Search for GIFs to get started</div>';
        return;
      }

      try {
        const res = await fetch(`/admin/giphy?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          resultsDiv.innerHTML = data.data.map(gif => `
            <img src="${gif.images.fixed_width.url}"
                 data-url="${gif.images.original.url}"
                 data-title="${gif.title}"
                 class="cursor-pointer hover:opacity-80 rounded transition"
                 onclick="selectGif('${gif.images.original.url}', '${gif.title.replace(/'/g, "\\'")}')">
          `).join('');
        } else {
          resultsDiv.innerHTML = '<div class="col-span-3 text-center text-gray-400 py-8">No GIFs found</div>';
        }
      } catch (error) {
        resultsDiv.innerHTML = '<div class="col-span-3 text-center text-red-500 py-8">Error loading GIFs</div>';
      }
    }, 300);
  });

  // Save button handler
  setTimeout(() => {
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    saveBtn.addEventListener('click', async () => {
      const url = document.getElementById('selected-gif-url').value;
      const title = document.getElementById('selected-gif-title').value;
      const published = document.getElementById('published').checked;

      if (!url) {
        alert('Please select a GIF');
        return;
      }

      saveBtn.textContent = 'Saving...';
      saveBtn.disabled = true;

      try {
        await fetch('/admin/entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'gif',
            content: { url, title },
            published,
          }),
        });

        editBlockModal.close();
        window.location.reload();
      } catch (error) {
        alert('Failed to save GIF: ' + error.message);
        saveBtn.textContent = 'Save';
        saveBtn.disabled = false;
      }
    });

    cancelBtn.addEventListener('click', () => editBlockModal.close());
  }, 0);
}

// Global function for selecting GIF
window.selectGif = function(url, title) {
  document.getElementById('selected-gif-url').value = url;
  document.getElementById('selected-gif-title').value = title;

  // Visual feedback
  document.querySelectorAll('#gif-results img').forEach(img => {
    img.classList.remove('ring-4', 'ring-purple-500');
  });
  event.target.classList.add('ring-4', 'ring-purple-500');
};

// Setup save/cancel for text and quote editors
document.addEventListener('click', async (e) => {
  if (e.target.id === 'save-btn' && (currentBlockType === 'text' || currentBlockType === 'quote')) {
    e.target.textContent = 'Saving...';
    e.target.disabled = true;

    try {
      let content, metadata;

      if (currentBlockType === 'text') {
        const text = document.getElementById('text-content').value;
        const font = document.getElementById('font-picker').value;
        const fontSize = document.getElementById('font-size').value + 'px';

        content = { text, font, fontSize, color: '#333333' };
        metadata = { font };
      } else if (currentBlockType === 'quote') {
        const text = document.getElementById('quote-text').value;
        const author = document.getElementById('quote-author').value;
        const font = document.getElementById('font-picker').value;

        content = { text, author, font };
        metadata = { font };
      }

      const published = document.getElementById('published').checked;

      await fetch('/admin/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: currentBlockType,
          content,
          published,
          metadata,
        }),
      });

      editBlockModal.close();
      window.location.reload();
    } catch (error) {
      alert('Failed to save: ' + error.message);
      e.target.textContent = 'Save';
      e.target.disabled = false;
    }
  }

  if (e.target.id === 'cancel-btn') {
    editBlockModal.close();
  }

  // Font size display update
  if (e.target.id === 'font-size') {
    document.getElementById('size-display').textContent = e.target.value + 'px';
  }

  // Delete button
  if (e.target.classList.contains('delete-btn')) {
    if (confirm('Are you sure you want to delete this entry?')) {
      const id = e.target.dataset.id;
      await fetch(`/admin/entry/${id}`, { method: 'DELETE' });
      window.location.reload();
    }
  }

  // Publish toggle
  if (e.target.classList.contains('publish-toggle')) {
    const id = e.target.dataset.id;
    const published = e.target.dataset.published === '1' ? 0 : 1;

    await fetch(`/admin/entry/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published }),
    });

    window.location.reload();
  }
});

// Listen for font size changes
document.addEventListener('input', (e) => {
  if (e.target.id === 'font-size') {
    document.getElementById('size-display').textContent = e.target.value + 'px';
  }
});
