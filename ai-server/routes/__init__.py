from flask import Blueprint

# Create a Blueprint object for the routes package
routes_bp = Blueprint("routes", __name__)

# Import route modules
from . import auth
from . import document
from . import query
from . import internal

# Register the route blueprints
routes_bp.register_blueprint(auth.auth_bp)
routes_bp.register_blueprint(document.document_bp)
routes_bp.register_blueprint(query.query_bp)
routes_bp.register_blueprint(internal.internal_bp)
