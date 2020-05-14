import React from 'react';

const BrowserCompatibility = () => {
    return <>
        <h3>Browser Compatibility</h3>
        <table className="table">
            <thead>
                <tr>
                    <th>Browser</th>
                    <th>Works?</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        Chrome
                    </td>
                    <td>
                        Yes
                    </td>
                </tr>
                <tr>
                    <td>
                        Firefox
                    </td>
                    <td>
                        Yes
                    </td>
                </tr>
                <tr>
                    <td>
                        Safari
                    </td>
                    <td>
                        Yes
                    </td>
                </tr>
                <tr>
                    <td>
                        IE 11
                    </td>
                    <td>
                        Yes
                    </td>
                </tr>
            </tbody>
        </table>
    </>;
};

export default BrowserCompatibility;