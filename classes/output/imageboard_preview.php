<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * unilabel type imageboard.
 *
 * @package     unilabeltype_imageboard
 * @author      Andreas Grabs <info@grabs-edv.de>
 * @copyright   2018 onwards Grabs EDV {@link https://www.grabs-edv.de}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace unilabeltype_imageboard\output;

/**
 * Component to render a preview of the imageboard.
 *
 * @package     unilabeltype_imageboard
 * @author      Andreas Grabs <info@grabs-edv.de>
 * @copyright   2018 onwards Grabs EDV {@link https://www.grabs-edv.de}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class imageboard_preview extends imageboard_view {

    /**
     * Constructor
     *
     * @param \unilabeltype_imageboard\content_type $unilabeltype
     * @param \stdClass $unilabel
     * @param \stdClass|null $cm The course_module record
     */
    public function __construct($unilabel, $unilabeltype, $cm = null) {
        parent::__construct($unilabel, $unilabeltype, $cm);

        $this->data->ispreviewmode = true;
        $this->data->cmid = 0;
        $this->data->intro = '';
        $this->data->showintro = false;
        $this->data->capababilityforgrid = true;
    }

    /**
     * Set the data for the intro text.
     *
     * @return void
     */
    protected function set_view_data() {
        global $USER;
        $this->data->cmid = 0;
        $this->data->intro = '';
        $this->data->showintro = false;
        $this->data->capababilityforgrid = true;
    }

    /**
     * Export for template.
     *
     * @param renderer_base $output The renderer.
     * @return stdClass
     */
    public function export_for_template(\renderer_base $output) {
        return $this->data;
    }
}
