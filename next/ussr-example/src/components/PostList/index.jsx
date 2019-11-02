import React from 'react';
import styles from './styles.modules.css';
import withStyles from '../../isomorphic/withStyles';

function PostList(props) {
    return <div className={styles.list}>
        <ul>
            {props.posts.map(item => {
                return <li key={item.id}>{item.title}</li>
            })}
        </ul>
    </div>
}

export default withStyles(styles)(PostList)
