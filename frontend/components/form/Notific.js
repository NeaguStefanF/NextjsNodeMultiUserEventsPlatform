import { useEffect, useState } from 'react';
import { isAuth } from '../../actions/auth';
import styles from '../../components/Header.module.css';

const Notific = ({ socket, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (socket) {
      socket.on('getNotification', ({ senderName, receiverNames, type }) => {
        if (receiverNames.includes(user.username)) {
          setNotifications((prev) => [...prev, { senderName, type }]);
        }
      });
    }
  }, [socket, user]);
  console.log(notifications);

  const displayNotification = ({ senderName, type }) => {
    let action;

    if (type === 1) {
      action = 'registred and send a email.';
    } else if (type === 2) {
      action = 'commented';
    } else {
      action = 'shared';
    }
    return <span className="notification">{`${senderName} ${action}`}</span>;
  };

  const handleRead = () => {
    setNotifications([]);
    setOpen(false);
  };

  return (
    <>
      {isAuth() && (
        <div
          className="btn btn-outline-secondary text-light position-relative"
          onClick={() => setOpen(!open)}
        >
          <img
            src="/static/images/register.svg"
            alt="Notification Icon"
            width={50}
            height={30}
            style={{ filter: 'invert(100%)' }}
          />
          <div className={`${styles['counter']}`}>
            <span className={`${styles['counter-text']}`}>
              {notifications.length}
            </span>
          </div>
          {open && (
            <div className={`${styles['notifications']}`}>
              {notifications.map((n) => displayNotification(n))}
              <button className={`${styles['nButton']}`} onClick={handleRead}>
                Mark as read
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Notific;
