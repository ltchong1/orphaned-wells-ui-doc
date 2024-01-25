import { render, screen } from '@testing-library/react';
import Subheader from "../components/Subheader/Subheader"

test('test Subheader', () => {

    render( <Subheader/> )

    //test for component elements
    screen.getByRole('button', { name: /new project/i })
    
})