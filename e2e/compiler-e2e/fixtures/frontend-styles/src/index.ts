import './global.css';
import './theme.scss';
import * as button from './button.module.css';
import * as card from './card.module.scss';
import * as panel from './panel.module.less';

document.body.innerHTML = `<div class="text-center theme ${card.card}"><button class="${button.primary}">ok</button><div class="${panel.panel}"></div></div>`;
