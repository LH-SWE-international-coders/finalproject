import React from 'react'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/footer'

describe('Footer', () => {
    it('renders the copyright notice', () => {
        render(<Footer />)
        const copyright = screen.getByText(/Built by SWE International Coders./)
        expect(copyright).toBeInTheDocument()
    })

    it('renders footer links', () => {
        render(<Footer />)
        expect(screen.getByText('Team Members')).toBeInTheDocument()
        expect(screen.getByText('Course Page')).toBeInTheDocument()
    })
})

