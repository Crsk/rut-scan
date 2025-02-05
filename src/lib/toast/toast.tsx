import _toast from 'react-hot-toast'

export const toast = ({ message, icon }: { message: string; icon?: string }) => {
  return _toast(message, { icon, style: { borderRadius: '6px', background: '#333', color: '#fff' } })
}
