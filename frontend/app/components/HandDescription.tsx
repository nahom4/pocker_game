import { Hand } from '@/app/types/pockerTypes';

interface HandDescriptionProps {
  hand: Hand;
  newGameStarted: boolean;
}

export function HandDescription({ hand, newGameStarted }: HandDescriptionProps) {
  const { dealer, small_blind, big_blind, small_blind_amount, big_blind_amount } = hand;
  if (!newGameStarted) {
    return null;
  }
  return (
    <>
      <div className="hand-info p-4 bg-white rounded-lg shadow-md " data-testid="hand-info">
        <h2 className=" mb-4" data-testid="hand-uuid"><strong className='text-lg'>Hand: #{hand.hand_uuid}</strong> </h2>
        <ul className=" list-inside" data-testid="players-hand">
          {hand.players_hand && hand.players_hand.map((card, index) => (
            <li key={index} className="mb-2" data-testid={`player-hand-${index}`}>
             <strong>Player {index}:</strong>  is dealt {card}
            </li>
          ))}
        </ul>
      </div>
      <div className="blind-info p-4 bg-white rounded-lg shadow-md mt-4 text-gray-700" data-testid="blind-info">
        <p  data-testid="dealer-info"><strong>Player {dealer}</strong>: is the dealer</p>
        <p  data-testid="small-blind-info"><strong>Player {small_blind} :</strong> posts small blind {small_blind_amount}</p>
        <p  data-testid="big-blind-info"><strong>Player {big_blind}:</strong> posts big blind {big_blind_amount}</p>
      </div>
    </>
  );
}
