/**
 * TableResponsive Component
 *
 * Accessible, responsive table component
 * - Desktop: Full table layout
 * - Mobile: Card-based stacked view with horizontal scroll option
 */

export class TableResponsive {
  /**
   * Render a responsive table
   *
   * @param {Object} options - Table configuration
   * @param {Array} options.headers - Array of header strings
   * @param {Array} options.rows - Array of row arrays
   * @param {string} options.caption - Optional table caption for accessibility
   * @param {string} options.className - Additional CSS classes
   * @param {boolean} options.striped - Alternate row colors
   * @param {boolean} options.hoverable - Add hover effect to rows
   */
  static render({
    headers,
    rows,
    caption,
    className = '',
    striped = true,
    hoverable = true
  }) {
    const tableClasses = `w-full text-left ${className}`;
    const rowHoverClass = hoverable ? 'hover:bg-gray-50 transition-colors' : '';

    return `
      <div class="overflow-x-auto -mx-4 sm:mx-0">
        <div class="inline-block min-w-full align-middle">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="${tableClasses}" role="table">
              ${caption ? `<caption class="sr-only">${caption}</caption>` : ''}

              <thead class="bg-gray-50" role="rowgroup">
                <tr role="row">
                  ${headers.map(header => `
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider"
                      role="columnheader"
                    >
                      ${header}
                    </th>
                  `).join('')}
                </tr>
              </thead>

              <tbody class="bg-white divide-y divide-gray-200" role="rowgroup">
                ${rows.map((row, index) => `
                  <tr
                    class="${striped && index % 2 === 1 ? 'bg-gray-50' : ''} ${rowHoverClass}"
                    role="row"
                  >
                    ${row.map((cell, cellIndex) => `
                      <td
                        class="px-6 py-4 text-base text-gray-700 whitespace-normal"
                        role="cell"
                        ${cellIndex === 0 ? 'data-label="' + headers[cellIndex] + '"' : ''}
                      >
                        ${cell}
                      </td>
                    `).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>
        /* Mobile-specific table styles */
        @media (max-width: 640px) {
          .overflow-x-auto table {
            display: block;
          }

          .overflow-x-auto thead {
            display: none;
          }

          .overflow-x-auto tbody,
          .overflow-x-auto tr,
          .overflow-x-auto td {
            display: block;
          }

          .overflow-x-auto tr {
            margin-bottom: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 0.75rem;
          }

          .overflow-x-auto td {
            padding: 0.5rem 0 !important;
            border: none;
            position: relative;
            padding-left: 50% !important;
          }

          .overflow-x-auto td:before {
            content: attr(data-label);
            position: absolute;
            left: 0;
            width: 45%;
            padding-right: 0.5rem;
            font-weight: 600;
            text-align: left;
          }
        }
      </style>
    `;
  }

  /**
   * Render a simple comparison table with color coding
   *
   * @param {Object} options - Comparison table configuration
   * @param {Array} options.headers - Table headers
   * @param {Array} options.rows - Array of row objects with { label, values, bgColor }
   */
  static renderComparison({ headers, rows, caption }) {
    return `
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" role="table">
          ${caption ? `<caption class="text-lg font-semibold text-gray-900 mb-4 text-left">${caption}</caption>` : ''}

          <thead role="rowgroup">
            <tr class="border-b-2 border-gray-300" role="row">
              ${headers.map(header => `
                <th
                  class="px-4 py-3 text-base font-semibold text-gray-900 uppercase tracking-wide"
                  scope="col"
                  role="columnheader"
                >
                  ${header}
                </th>
              `).join('')}
            </tr>
          </thead>

          <tbody role="rowgroup">
            ${rows.map(row => `
              <tr
                class="border-b border-gray-200 ${row.bgColor || ''}"
                role="row"
              >
                <th
                  scope="row"
                  class="px-4 py-3 font-medium text-gray-900 text-base"
                  role="rowheader"
                >
                  ${row.label}
                </th>
                ${row.values.map(value => `
                  <td class="px-4 py-3 text-base text-gray-700" role="cell">
                    ${value}
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

export default TableResponsive;
