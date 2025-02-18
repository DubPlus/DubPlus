/**
 *
 * @param {string} className
 * @param {string} textContent
 */
export function insertQueupChat(className, textContent) {
  const li = document.createElement('li');
  li.className = `dubplus-chat-system ${className}`;

  const chatDelete = document.createElement('div');
  chatDelete.className = 'chatDelete';
  chatDelete.onclick = function (e) {
    /**@type {HTMLDivElement}*/ (e.target).parentElement.remove();
  };

  const span = document.createElement('span');
  span.className = 'icon-close';

  chatDelete.appendChild(span);
  li.appendChild(chatDelete);

  const text = document.createElement('div');
  text.className = 'text';
  text.textContent = textContent;
  li.appendChild(text);
  document.querySelector('ul.chat-main').appendChild(li);
}
