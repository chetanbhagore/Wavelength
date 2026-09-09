/**
 * @module types/propTypes
 * Shared PropTypes shape definitions used across all Wavelength components.
 * Centralizes type validation to enforce consistent data contracts.
 */

import PropTypes from 'prop-types';

/**
 * Shape for a broadcast frequency object.
 * Represents one of the 8 emotional frequency channels.
 */
export const FrequencyShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  mhz: PropTypes.string.isRequired,
  tagline: PropTypes.string,
  mood: PropTypes.string.isRequired,
  colorAccent: PropTypes.string.isRequired,
});

/**
 * Shape for a room participant (stranger).
 */
export const ParticipantShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  avatarColor: PropTypes.string.isRequired,
});

/**
 * Shape for a chat message in the room stream.
 */
export const MessageShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  sender: PropTypes.string,
  text: PropTypes.string.isRequired,
  isUser: PropTypes.bool,
  isSystem: PropTypes.bool,
  timestamp: PropTypes.number,
  resonated: PropTypes.bool,
  avatarColor: PropTypes.string,
});

/**
 * Shape for a residual echo card.
 */
export const EchoShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  frequencyId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
});

/**
 * Shape for frequency visit history info.
 */
export const VisitInfoShape = PropTypes.shape({
  count: PropTypes.number,
  lastVisited: PropTypes.number,
});
