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
 * Component to render a view of the imageboard.
 *
 * @package     unilabeltype_imageboard
 * @author      Andreas Grabs <info@grabs-edv.de>
 * @copyright   2018 onwards Grabs EDV {@link https://www.grabs-edv.de}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace unilabeltype_imageboard\output;

/**
 * Content type definition.
 * @package     unilabeltype_imageboard
 * @author      Andreas Grabs <info@grabs-edv.de>
 * @copyright   2018 onwards Grabs EDV {@link https://www.grabs-edv.de}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class imageboard_view implements \renderable, \templatable {

    /** @var \stdClass */
    protected $data;
    /** @var \stdClass */
    protected $unilabel;
    /** @var \unilabeltype_imageboard\content_type */
    protected $unilabeltype;
    /** @var \stdClass */
    protected $unilabeltyperecord;
    /** @var \stdClass */
    protected $cm;

    /**
     * Constructor
     *
     * @param \unilabeltype_imageboard\content_type $unilabeltype
     * @param \stdClass $unilabel
     * @param \stdClass $cm The course_module record
     */
    public function __construct($unilabel, $unilabeltype, $cm) {

        $this->data = new \stdClass();
        $this->unilabel = $unilabel;
        $this->unilabeltype = $unilabeltype;
        $this->cm = $cm;

        $this->unilabeltyperecord = $unilabeltype->load_unilabeltype_record($unilabel->id);

        $this->set_common_data();
        $this->set_view_data(); // Load some instance related data.

    }

    /**
     * Set data which are independend.
     *
     * @return void
     */
    protected function set_common_data() {
        global $PAGE;

        $bordercolor = $this->unilabeltype->get_config()->default_bordercolor ?? '#ff0000';
        $gridcolor = $this->unilabeltype->get_config()->default_gridcolor ?? '#ff0000';

        $images = [];
        $hasimages = false;
        foreach ($this->unilabeltype->get_images() as $image) {
            $hasimages = true;
            if ($image->imageurl != '') {
                $image->imageurl = $image->imageurl->out();
            } else {
                $image->imageurl = '';
            }
            if (!empty($image->border)) {
                $image->border = $image->border;
            }
            $images[] = $image;
        }

        // Create a 50x50px helpergrid if $capababilityforgrid.
        $canvaswidth = $this->unilabeltyperecord->canvaswidth;
        $canvasheight = $this->unilabeltyperecord->canvasheight;
        $autoscale = $this->unilabeltyperecord->autoscale;

        $helpergrids = [];
        for ($y = 0; $y < $canvasheight; $y = $y + 50) {
            for ($x = 0; $x < $canvaswidth; $x = $x + 50) {
                $helpergrid = [];
                $helpergrid['x'] = $x;
                $helpergrid['y'] = $y;
                $helpergrids[] = $helpergrid;
            }
        }

        $this->data->images = $images;
        $this->data->hasimages = $hasimages;
        $this->data->canvaswidth = $canvaswidth;
        $this->data->canvasheight = $canvasheight;
        $this->data->autoscale = $autoscale;
        $this->data->backgroundimage = $this->unilabeltyperecord->backgroundimage;
        $this->data->fontsize = $this->unilabeltyperecord->fontsize;
        $this->data->titlecolor = $this->unilabeltyperecord->titlecolor;
        $this->data->titlebackgroundcolor = $this->unilabeltyperecord->titlebackgroundcolor;
        $this->data->bordercolor = $bordercolor;
        $this->data->gridcolor = $gridcolor;
        $this->data->helpergrids = $helpergrids;
        $this->data->editing = $PAGE->user_is_editing();

    }

    /**
     * Set the data for the intro text.
     *
     * @return void
     */
    protected function set_view_data() {
        global $USER;
        $intro = $this->unilabeltype->format_intro($this->unilabel, $this->cm);
        // Do not show intro in preview mode.
        $showintro = !empty($this->unilabeltyperecord->showintro);

        // Check if the user can edit the unilabel.
        // Then there should be a 50x50px grid visible that can be help for better positioning the images.
        $context = \context_module::instance($this->cm->id);
        $capababilityforgrid = has_capability('mod/unilabel:edit', $context, $USER->id, true);

        $this->data->cmid = $this->cm->id;
        $this->data->intro = $intro;
        $this->data->showintro = $showintro;
        $this->data->capababilityforgrid = $capababilityforgrid;
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
