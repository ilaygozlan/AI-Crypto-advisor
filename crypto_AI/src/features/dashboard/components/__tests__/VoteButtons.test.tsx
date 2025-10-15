import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { VoteButtons } from '@/components/common/VoteButtons'

describe('VoteButtons', () => {
  const mockOnVote = vi.fn()

  beforeEach(() => {
    mockOnVote.mockClear()
  })

  it('renders vote buttons with correct counts', () => {
    render(
      <VoteButtons
        upVotes={100}
        downVotes={25}
        onVote={mockOnVote}
      />
    )

    expect(screen.getByLabelText(/vote up \(100 votes\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/vote down \(25 votes\)/i)).toBeInTheDocument()
  })

  it('calls onVote with correct vote type when up button is clicked', () => {
    render(
      <VoteButtons
        upVotes={100}
        downVotes={25}
        onVote={mockOnVote}
      />
    )

    const upButton = screen.getByLabelText(/vote up/i)
    fireEvent.click(upButton)

    expect(mockOnVote).toHaveBeenCalledWith('up')
  })

  it('calls onVote with correct vote type when down button is clicked', () => {
    render(
      <VoteButtons
        upVotes={100}
        downVotes={25}
        onVote={mockOnVote}
      />
    )

    const downButton = screen.getByLabelText(/vote down/i)
    fireEvent.click(downButton)

    expect(mockOnVote).toHaveBeenCalledWith('down')
  })

  it('shows active state for up vote', () => {
    render(
      <VoteButtons
        upVotes={100}
        downVotes={25}
        userVote="up"
        onVote={mockOnVote}
      />
    )

    const upButton = screen.getByLabelText(/vote up/i)
    expect(upButton).toHaveClass('bg-green-100')
  })

  it('shows active state for down vote', () => {
    render(
      <VoteButtons
        upVotes={100}
        downVotes={25}
        userVote="down"
        onVote={mockOnVote}
      />
    )

    const downButton = screen.getByLabelText(/vote down/i)
    expect(downButton).toHaveClass('bg-red-100')
  })

  it('disables buttons when disabled prop is true', () => {
    render(
      <VoteButtons
        upVotes={100}
        downVotes={25}
        onVote={mockOnVote}
        disabled={true}
      />
    )

    const upButton = screen.getByLabelText(/vote up/i)
    const downButton = screen.getByLabelText(/vote down/i)

    expect(upButton).toBeDisabled()
    expect(downButton).toBeDisabled()
  })
})
