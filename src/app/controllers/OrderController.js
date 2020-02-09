import Order from '../models/Orders';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'recipient_name', 'cep'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(orders);
  }

  async store(req, res) {
    const { id, recipient_id, deliveryman_id, product } = await Order.create(
      req.body,
      {
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['id'],
          },
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id'],
          },
        ],
      }
    );

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async update(req, res) {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    await order.update(req.body);

    const {
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'recipient_name', 'cep'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    await Order.destroy();

    return res.json({
      success: `Order with id ${req.params.id} was deleted`,
    });
  }
}

export default new OrderController();
