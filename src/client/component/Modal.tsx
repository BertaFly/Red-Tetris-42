import * as React from 'react';

type Props = {
  onClose: () => void
  show: boolean
  children: React.ReactChild
  isWin?: string
}

export const Modal: React.FC<Props> = ({ onClose, show, children, isWin = 'default' }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className={`modal-main modal-color-${isWin}`}>
        {children}
        <button onClick={onClose}>close</button>
      </section>
    </div>
  );
};
