import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />)
});

test('renders the contact form header', ()=> {
    render(<ContactForm />)
    const header = screen.queryByText(/contact form/i)

    expect(header).toBeInTheDocument()
    expect(header).toBeTruthy()
    expect(header).toHaveTextContent(/contact form/i)
});

test('renders ONE error message if user enters less then 4 characters into firstname.', async () => {
    render(<ContactForm />)
    const firstName = await screen.findByPlaceholderText(/edd/i)
    userEvent.type(firstName,'333')
    expect(await screen.findAllByTestId('error')).toHaveLength(1)
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)
    const submitButton = screen.getByRole('button')
    userEvent.click(submitButton)
    await waitFor(() => {
        expect(screen.queryAllByTestId('error')).toHaveLength(3)
    })
    
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)
    const firstName = screen.getByLabelText(/first name/i)
    const lastName = screen.getByLabelText(/last name/i)
    const submitButton = screen.getByRole('button')
    userEvent.type(firstName,'Charles')
    userEvent.type(lastName,'Qian')
    userEvent.click(submitButton)

    await waitFor(() => {
        expect(screen.queryAllByTestId('error')).toHaveLength(1)
    })
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)
    const email = screen.getByLabelText(/email/i)
    userEvent.type(email,'charles')
    expect(await screen.findByText(/email must be a valid email address/i)).toBeInTheDocument()
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
   render (<ContactForm />)
   const submitButton = screen.getByRole('button')
   userEvent.click(submitButton)
   expect (await screen.getByText(/lastName is a required field/i)).toBeInTheDocument() 
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render (<ContactForm />)
    const firstName = screen.getByLabelText(/first name/i)
    const lastName = screen.getByLabelText(/last name/i)
    const email = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button')
    userEvent.type(firstName,'charles')
    userEvent.type(lastName,'qian')
    userEvent.type(email,'charles@charles.charles')
    userEvent.click(submitButton)

    await waitFor(() => {
        expect(screen.queryByText('charles')).toBeInTheDocument()
        expect(screen.queryByText('qian')).toBeInTheDocument()
        expect(screen.queryByText('charles@charles.charles')).toBeInTheDocument()
        expect(screen.queryByTestId('messageDisplay')).not.toBeInTheDocument()
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render (<ContactForm />)
    const firstName = screen.getByLabelText(/first name/i)
    const lastName = screen.getByLabelText(/last name/i)
    const email = screen.getByLabelText(/email/i)
    const message = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button')
    userEvent.type(firstName,'charles')
    userEvent.type(lastName,'qian')
    userEvent.type(email,'charles@charles.charles')
    userEvent.type(message,'a message')
    userEvent.click(submitButton)

    await waitFor(() => {
        expect(screen.queryByTestId('firstnameDisplay')).toBeInTheDocument()
        expect(screen.queryByTestId('lastnameDisplay')).toBeInTheDocument()
        expect(screen.queryByTestId('emailDisplay')).toBeInTheDocument()
        expect(screen.queryByTestId('messageDisplay')).toBeInTheDocument()
    })
});