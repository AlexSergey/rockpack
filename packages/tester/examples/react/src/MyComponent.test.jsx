import React from 'react'
import { render, cleanup } from '@testing-library/react';
import MyComponent from './MyComponent';

afterEach(cleanup);

describe('This will test MyComponent', () => {
    test('renders message', () => {
        const {getByText} = render(<MyComponent
            firstName="Alejandro"
            lastName="Roman"
        />);

        // as suggested by Giorgio Polvara a more idiomatic way:
        expect(getByText('Hi Alejandro Roman!')).toBeInTheDocument()
    });
});
