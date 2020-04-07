import React from 'react';
import ReactDOM from 'react-dom';
import i18n from './i18n';
import App from './App';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
/*
const App = (props) => {
  const { t, i18n } = useTranslation();

  return <h1>{t('Welcome to React')}</h1>
};
*/
ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, document.getElementById('root'));
