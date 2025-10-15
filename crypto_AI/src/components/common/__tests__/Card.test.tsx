import { render, screen } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  it('renders card with title and content', () => {
    render(
      <Card title="Test Card">
        <p>Test content</p>
      </Card>
    )

    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders card without title', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Card className="custom-class" title="Test Card">
        <p>Test content</p>
      </Card>
    )

    const card = screen.getByText('Test Card').closest('div')
    expect(card).toHaveClass('custom-class')
  })

  it('disables hover effect when hover prop is false', () => {
    render(
      <Card hover={false} title="Test Card">
        <p>Test content</p>
      </Card>
    )

    const card = screen.getByText('Test Card').closest('div')
    expect(card).not.toHaveClass('card-hover')
  })
})
