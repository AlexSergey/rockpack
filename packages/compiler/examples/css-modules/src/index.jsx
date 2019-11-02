import './global.scss';
import React from 'react';
import { render } from 'react-dom';
import styles from './styles.modules.scss'

render(<div className="myclass">
    <div className={styles.block}>
        <h1>Test</h1>
    </div>
</div>, document.getElementById('root'));
